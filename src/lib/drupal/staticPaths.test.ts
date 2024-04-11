import { getStaticPathsByResourceType } from './staticPaths'
import { queries } from '@/data/queries'
import { pathToSlug } from '@/lib/utils/slug'

jest.mock('@/data/queries')

describe('getStaticPathsByResourceType', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return static paths for a given resource type', async () => {
    const resourceType = 'node--landing_page'
    const mockResources = [
      { id: 1, path: '/example-1' },
      { id: 2, path: '/example-2' },
    ]

    ;(queries.getData as jest.Mock).mockResolvedValue(mockResources)

    const expectedStaticPaths = mockResources.map((resource) => ({
      params: { slug: pathToSlug(resource.path) },
    }))

    const result = await getStaticPathsByResourceType(resourceType)

    expect(queries.getData).toHaveBeenCalledWith('static-path-resources', {
      resourceType,
    })
    expect(result).toEqual(expectedStaticPaths)
  })

  it('should return empty array if no resources are fetched', async () => {
    const resourceType = 'node--landing_page'
    const mockResources = []

    ;(queries.getData as jest.Mock).mockResolvedValue(mockResources)

    const expectedStaticPaths = []

    const result = await getStaticPathsByResourceType(resourceType)

    expect(queries.getData).toHaveBeenCalledWith('static-path-resources', {
      resourceType,
    })
    expect(result).toEqual(expectedStaticPaths)
  })

  it('should handle errors when fetching resources', async () => {
    const resourceType = 'node--landing_page'
    const errorMessage = 'Error fetching resources'

    ;(queries.getData as jest.Mock).mockRejectedValue(new Error(errorMessage))

    await expect(getStaticPathsByResourceType(resourceType)).rejects.toThrow(
      errorMessage
    )
  })
})
