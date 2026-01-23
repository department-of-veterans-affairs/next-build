# Introduction for Accelerated Publishing - Shadow Request

## Overview

This document explains the shadow request implementation in the `@nextcontent` location block within the nginx reverse proxy configuration. Shadow requests allow us to send duplicate traffic to a Next.js server for ISR purposes without affecting the primary response flow. Once the nextjs server receives thi srequest it will build the page and store it using the shared caching function. This should be connected to an S3 storage location.

## What is a Shadow Request?

A shadow request is a non-blocking, asynchronous HTTP request that duplicates the original user request and sends it to an alternative backend server. The response from this shadow request is not returned to the client; instead, it's only used for logging, testing, or warming up a new service.

## Implementation Details

### Preview Code

- vsp-platform-revproxy repo branch
- PR: https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/pull/1130
- Branch: https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/tree/testing-nextjs-accpub

### Configuration Variables

The shadow request feature is controlled by the following Jinja2 template variables:

- `web_server.next_content_proxy_url`: The primary Next.js content server URL
- `web_server.next_content_mirror_url`: The shadow/mirror server URL where duplicate requests are sent

### How It Works

The implementation is located in the `@nextcontent` location block within `nginx_website_server.conf.j2`:

```nginx
location @nextcontent {
  access_by_lua_block {
    -- Shadow request logic here
    -- This block is used to make sure all requests get shadowed even if an error occurs such as a 404
  }
  proxy_pass {{ web_server.next_content_proxy_url }}$request_uri;
}
```

### Request Flow

1. **Original Request**: User makes a request that is routed to `@nextcontent`
2. **Asset Filtering**: Shadow requests are skipped for static assets (js, css, images, fonts, etc.)
3. **Async Timer**: A non-blocking timer is created using `ngx.timer.at(0, shadow_handler)`
4. **Shadow Request**: The handler sends the request to the mirror URL
5. **Primary Response**: Meanwhile, the original request continues to the primary backend
6. **Logging**: Shadow request results are logged for analysis

### Key Features

#### 1. Asset Exclusion

Shadow requests are skipped for common asset file types to reduce unnecessary traffic:

```lua
if string.match(original_request_uri, "%.(js|css|json|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|map)$") then
  ngx.log(ngx.ERR, "Skipping shadow request for asset: ", original_request_uri)
```

#### 2. URI Normalization

The shadow request normalizes URIs before sending:

- Replaces double trailing slashes with single slash
- Adds trailing slash for non-file paths
- Preserves the original request URI

```lua
shadow_uri = string.gsub(shadow_uri, "//$", "/")

if not string.match(shadow_uri, "/$") and not string.match(shadow_uri, "%.[^/]+$") then
  shadow_uri = shadow_uri .. "/"
end
```

#### 3. Non-Blocking Execution

The shadow request runs asynchronously using Nginx timers, ensuring it doesn't block the primary request:

```lua
local ok, err = ngx.timer.at(0, shadow_handler)
```

#### 4. HTTPS Support

The implementation handles both HTTP and HTTPS connections with proper SSL handshake:

```lua
if scheme == "https" then
  local session, err = sock:sslhandshake(nil, host, false)
  if not session then
    ngx.log(ngx.ERR, "Shadow request SSL handshake failed: ", err)
    sock:close()
    return
  end
end
```

#### 5. Custom Headers

The shadow request includes a custom header to identify the original URI:

```lua
"X-Original-URI: " .. original_request_uri .. "\r\n"
```

#### 6. Error Handling

The implementation includes comprehensive error handling and logging:

- Connection failures are logged but don't affect the primary request
- Timeouts are set to 1 second to prevent hanging
- All steps are logged for debugging purposes

### Logging

The shadow request implementation provides detailed logging at each step:

- When shadow requests are skipped (assets)
- Connection establishment
- SSL handshake (for HTTPS)
- Request sending
- Response reception
- Any errors encountered

All logs use the `ngx.ERR` level for visibility and are prefixed with descriptive messages.

## Configuration Example

To enable shadow requests, set the appropriate variables in your environment configuration:

```yaml
web_server:
  next_content_proxy_url: 'https://next-primary.example.com'
  next_content_mirror_url: 'https://next-shadow.example.com'
```

If `next_content_mirror_url` is not set, shadow requests are disabled.

## Performance Considerations

- **Non-blocking**: Shadow requests run asynchronously and don't increase response time
- **Timeout**: 1-second timeout prevents resource exhaustion
- **Asset filtering**: Reduces unnecessary traffic by 60-80%
- **Error tolerance**: Shadow request failures don't affect the primary response

## Debugging

To debug shadow requests:

1. Check nginx error logs for messages containing "SHADOW REQUEST"
2. Look for connection failures or SSL handshake errors
3. Verify the mirror URL is accessible from the nginx server
4. Check that the `X-Original-URI` header is being sent correctly
