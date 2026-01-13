import { EnvVars } from '.'

const removeTrailingSlash = (s: string): string =>
  s.endsWith('/') ? s.substring(0, s.length - 1) : s

export const getCmsFeatureFlags = async (
  drupalBaseUrl: string
): Promise<EnvVars> => {
  const featureFlagUrl = `${removeTrailingSlash(drupalBaseUrl)}/flags_list`
  const response = await fetch(featureFlagUrl)
  const json = await response.json()
  return json.data
}
