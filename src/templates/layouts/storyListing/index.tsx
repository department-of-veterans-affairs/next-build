/* eslint-disable no-console */
/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects data of type {@link StoryListingType}.
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { NewsStoryTeaserType, StoryListingType } from '@/types/index'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'

export function StoryListing({
  id,
  title,
  introText,
  stories,
  menu,
  currentPage,
  totalPages,
}: StoryListingType) {
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    // @ts-ignore
    window.sideNav = {
      "rootPath": "/butler-health-care/stories/",
      "data": {
          "name": "VA Butler health care",
          "description": "VISN 4 | va.gov/butler-health-care",
          "links": [
              {
                  "expanded": false,
                  "description": null,
                  "label": "VA Butler health care",
                  "url": {
                      "path": "/butler-health-care"
                  },
                  "entity": {
                      "linkedEntity": {
                          "entityPublished": true,
                          "moderationState": "published"
                      }
                  },
                  "links": [
                      {
                          "expanded": true,
                          "description": null,
                          "label": "Services and Locations",
                          "url": {
                              "path": ""
                          },
                          "entity": {
                              "linkedEntity": null
                          },
                          "links": [
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Health services",
                                  "url": {
                                      "path": "/butler-health-care/health-services"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Locations",
                                  "url": {
                                      "path": "/butler-health-care/locations"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": [
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Butler VA Medical Center",
                                          "url": {
                                              "path": "/butler-health-care/locations/butler-va-medical-center"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Abie Abraham VA Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/abie-abraham-va-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Armstrong County VA Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/armstrong-county-va-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Clarion County VA Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/clarion-county-va-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Cranberry Township VA Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/cranberry-township-va-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Lawrence County VA Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/lawrence-county-va-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Michael A. Marzano VA Outpatient Clinic",
                                          "url": {
                                              "path": "/butler-health-care/locations/michael-a-marzano-department-of-veterans-affairs-outpatient-clinic"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "expanded": true,
                          "description": null,
                          "label": "News and Events",
                          "url": {
                              "path": ""
                          },
                          "entity": {
                              "linkedEntity": null
                          },
                          "links": [
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Events",
                                  "url": {
                                      "path": "/butler-health-care/events"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "News releases",
                                  "url": {
                                      "path": "/butler-health-care/news-releases"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Stories",
                                  "url": {
                                      "path": "/butler-health-care/stories"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              }
                          ]
                      },
                      {
                          "expanded": true,
                          "description": null,
                          "label": "About VA Butler",
                          "url": {
                              "path": ""
                          },
                          "entity": {
                              "linkedEntity": null
                          },
                          "links": [
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "About us",
                                  "url": {
                                      "path": "/butler-health-care/about-us"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": [
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Mission and vision",
                                          "url": {
                                              "path": "/butler-health-care/about-us/mission-and-vision"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "History",
                                          "url": {
                                              "path": "/butler-health-care/about-us/history"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Performance",
                                          "url": {
                                              "path": "/butler-health-care/about-us/performance"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Leadership",
                                          "url": {
                                              "path": "/butler-health-care/about-us/leadership"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      }
                                  ]
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Work with us",
                                  "url": {
                                      "path": "/butler-health-care/work-with-us"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": [
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Jobs and careers",
                                          "url": {
                                              "path": "/butler-health-care/work-with-us/jobs-and-careers"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": [
                                              {
                                                  "expanded": false,
                                                  "description": null,
                                                  "label": "Nursing Recruitment",
                                                  "url": {
                                                      "path": "/butler-health-care/work-with-us/jobs-and-careers/butler-va-nursing-careers"
                                                  },
                                                  "entity": {
                                                      "linkedEntity": {
                                                          "entityPublished": true,
                                                          "moderationState": "published"
                                                      }
                                                  },
                                                  "links": []
                                              }
                                          ]
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Volunteer or donate",
                                          "url": {
                                              "path": "/butler-health-care/work-with-us/volunteer-or-donate"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Internships and fellowships",
                                          "url": {
                                              "path": "/butler-health-care/work-with-us/internships-and-fellowships"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      }
                                  ]
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Programs",
                                  "url": {
                                      "path": "/butler-health-care/programs"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": [
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Connected Care",
                                          "url": {
                                              "path": "/butler-health-care/programs/connected-care"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Medical Foster Home Program",
                                          "url": {
                                              "path": "/butler-health-care/programs/medical-foster-home-program"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      },
                                      {
                                          "expanded": false,
                                          "description": null,
                                          "label": "Whole Health",
                                          "url": {
                                              "path": "/butler-health-care/programs/whole-health"
                                          },
                                          "entity": {
                                              "linkedEntity": {
                                                  "entityPublished": true,
                                                  "moderationState": "published"
                                              }
                                          },
                                          "links": []
                                      }
                                  ]
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Contact us",
                                  "url": {
                                      "path": "/butler-health-care/contact-us"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              },
                              {
                                  "expanded": false,
                                  "description": null,
                                  "label": "Policies",
                                  "url": {
                                      "path": "/butler-health-care/policies"
                                  },
                                  "entity": {
                                      "linkedEntity": {
                                          "entityPublished": true,
                                          "moderationState": "published"
                                      }
                                  },
                                  "links": []
                              }
                          ]
                      }
                  ]
              }
          ]
      }
    }

    // @ts-ignore
    console.log(window.sideNav)
    console.log(menu)
  }, [menu])

  const storyTeasers =
    stories?.length > 0 ? (
      stories?.map((story: NewsStoryTeaserType) => (
        <li key={story.id}>
          <NewsStoryTeaser {...story} />
        </li>
      ))
    ) : (
      <li className="clearfix-text">No stories at this time.</li>
    )

  return (
    <div key={id} className="usa-grid usa-grid-full">

      {/* Widget coming from vets-website */}
      <nav data-template="navigation/facility_sidebar_nav" aria-label="secondary" data-widget-type="side-nav"></nav>

      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <h1>{title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {introText && <p className="events-show">{introText}</p>}
            </div>
            <div className="vads-l-grid-container--full">
              <ul className="usa-unstyled-list">{storyTeasers}</ul>
            </div>

            {totalPages > 1 && (
              <VaPagination
                page={currentPage}
                pages={totalPages}
                maxPageListLength={3}
                onPageSelect={(page) => {
                  const newPage =
                    page.detail.page > 1 ? `page-${page.detail.page}` : ''
                  const newUrl = window.location.href.replace(
                    /(?<=stories\/).*/, // everything after /stories/
                    newPage
                  )
                  window.location.assign(newUrl)
                }}
              />
            )}
          </div>
          <ContentFooter />
        </article>
      </div>
    </div>
  )
}
