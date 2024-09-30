import { getFetcher } from 'proxy-fetcher'
import { EnvVars } from '.'

const removeTrailingSlash = (s: string): string =>
  s.endsWith('/') ? s.substring(0, s.length - 1) : s

export const getCmsFeatureFlags = async (
  drupalBaseUrl: string,
  debug: boolean = false
): Promise<EnvVars> => {
  const fetcher = getFetcher(drupalBaseUrl, debug)
  const featureFlagUrl = `${removeTrailingSlash(drupalBaseUrl)}/flags_list`
  const response = await fetcher(featureFlagUrl)
  const json = await response.json()
  return json.data
}
