import { FormattedParagraph } from '@/lib/drupal/queries'

export const nestedQaParagraphs: FormattedParagraph[] = [
  {
    type: 'paragraph--q_a_section',
    id: '9f11f1d1-47c9-4461-af9e-3b2155028e72',
    displayAccordion: false,
    header: null,
    intro: null,
    questions: [
      {
        type: 'paragraph--q_a',
        question: 'What is mpox?',
        answers: [
          {
            type: 'paragraph--wysiwyg',
            id: '21c7ab2b-6caa-438f-8133-f308bb37755b',
            html: '<p>Mpox is a rare disease caused by infection with the mpox virus. The mpox virus is part of the same family of viruses as the variola virus, the virus that causes smallpox. Mpox symptoms are similar to smallpox symptoms, but milder, and mpox is rarely fatal. Mpox is not related to chickenpox.</p>',
          },
        ],
        id: '56597b36-3c81-4ca3-92b2-465bc4121d34',
      },
      {
        type: 'paragraph--q_a',
        question: 'What are signs and symptoms of mpox?',
        answers: [
          {
            type: 'paragraph--wysiwyg',
            id: 'c12156c6-5dda-40fa-b2d2-b00e7254d253',
            html: '<p>Sign and symptoms</p>',
          },
          {
            type: 'paragraph--collapsible_panel',
            id: '68824e7d-b5cd-4f1e-a8b3-8af70c2bd51e',
            entityId: 114599,
            paragraphs: [
              {
                type: 'paragraph--collapsible_panel_item',
                id: '084bb12d-1f76-495e-8acc-4d1e805641c5',
                entityId: 114598,
                title: 'Symptoms of mpox',
                wysiwyg:
                  '<ul>\n' +
                  '\t<li>Fever</li>\n' +
                  '\t<li>Headache</li>\n' +
                  '\t<li>Muscle aches and backache</li>\n' +
                  '\t<li>Swollen lymph nodes</li>\n' +
                  '\t<li>Chills</li>\n' +
                  '\t<li>Exhaustion</li>\n' +
                  '\t<li>Respiratory symptoms (e.g. sore throat, nasal congestion, or cough)</li>\n' +
                  '\t<li>A rash that may be located on or near the genitals (penis, testicles, labia, and vagina) or anus (butthole) but could also be on other areas like the hands, feet, chest, face, or mouth.\n' +
                  '\t<ul>\n' +
                  '\t\t<li>The rash will go through several stages, including scabs, before healing.</li>\n' +
                  '\t\t<li>The rash can look like pimples or blisters and may be painful or itchy.</li>\n' +
                  '\t</ul>\n' +
                  '\t</li>\n' +
                  '</ul>\n',
                paragraphs: [],
              },
            ],
            bordered: false,
          },
        ],
        id: 'c48857ed-0660-4d22-82d3-75bac5b47495',
      },
      {
        type: 'paragraph--q_a',
        question: 'How does it spread?',
        answers: [
          {
            type: 'paragraph--wysiwyg',
            id: '32f3d59b-6b93-4d85-807c-748915624da5',
            html: '<p>Mpox spreads in a few ways.</p>',
          },
          {
            type: 'paragraph--collapsible_panel',
            id: '7f4bede0-9260-46ce-8a18-2eeb6ee2d3d6',
            entityId: 114605,
            paragraphs: [
              {
                type: 'paragraph--collapsible_panel_item',
                id: 'c7e743d5-fffe-450f-9983-88655ff3567f',
                entityId: 114602,
                title: 'Through close, personal, often skin-to-skin contact',
                wysiwyg:
                  '<ul><li>Mpox can spread to anyone through close, personal, often skin-to-skin contact, including:<ul><li>Direct contact with mpox rash, scabs, or body fluids from a person with mpox.</li><li>Touching objects, fabrics (clothing, bedding, or towels), and surfaces that have been used by someone with mpox.</li><li>Contact with respiratory secretions.</li></ul></li></ul>',
                paragraphs: [],
              },
              {
                type: 'paragraph--collapsible_panel_item',
                id: '40b8e8c5-d7dd-4658-bde8-d8e9f0c8d11a',
                entityId: 114603,
                title: 'Direct contact ',
                wysiwyg:
                  '<ul><li>This direct contact can happen during intimate contact, including:<ul><li>Oral, anal, and vaginal sex&nbsp;or touching the genitals (penis, testicles, labia, and vagina) or anus (butthole) of a person with mpox.</li><li>Hugging, massage, and kissing.</li><li>Prolonged face-to-face contact.</li><li>Touching fabrics and objects during sex that were used by a person with mpox and that have not been disinfected, such as bedding, towels, fetish gear, and sex toys.</li></ul></li></ul>',
                paragraphs: [],
              },
              {
                type: 'paragraph--collapsible_panel_item',
                id: '0c0ac5da-7535-4a91-93c9-adcd1da53a10',
                entityId: 114604,
                title: 'Pregnancy',
                wysiwyg:
                  '<ul><li>A pregnant person can spread the virus to their fetus through the placenta.</li></ul>',
                paragraphs: [],
              },
            ],
            bordered: false,
          },
          {
            type: 'paragraph--wysiwyg',
            id: 'd34372d4-3443-49bd-9847-e068df1a1bda',
            html: '<p>It’s also possible for people to get mpox from infected animals, either by being scratched or bitten by the animal or by preparing or eating meat or using products from an infected animal. A person with mpox can spread it to others from the time symptoms start until the rash has fully healed and a fresh layer of skin has formed. The illness typically lasts 2-4 weeks.</p><p>Scientists are still researching:</p><ul><li>If the virus can be spread when someone has no&nbsp;<a href="https://www.cdc.gov/mpox/signs-symptoms/index.html">symptoms</a></li><li>How often mpox is spread through respiratory secretions, or when a person with mpox symptoms might be more likely to spread the virus through respiratory secretions.</li><li>Whether mpox can be spread through semen, vaginal fluids, urine, or feces.</li></ul>',
          },
        ],
        id: '55a5cad7-f029-4765-9c98-88b27d84f2c8',
      },
      {
        type: 'paragraph--q_a',
        question: 'How can I protect myself and others?',
        answers: [
          {
            type: 'paragraph--wysiwyg',
            id: '41b015f6-1729-4a88-bd6c-43db22188da4',
            html: '<ul><li>Avoid close, skin-to-skin contact with people who have a rash that looks like mpox.<ul><li>Do not touch the rash or scabs of a person with mpox.</li><li>Do not kiss, hug, cuddle or have sex with someone with mpox.</li></ul></li><li>Avoid contact with objects and materials that a person with mpox has used.<ul><li>Do not share eating utensils or cups with a person with mpox.</li><li>Do not handle or touch the bedding, towels, or clothing of a person with mpox.</li></ul></li><li>Wash your hands often with soap and water or use an alcohol-based hand sanitizer, especially before eating or touching your face and after you use the bathroom.</li></ul><p>In Central and West Africa, avoid contact with animals that&nbsp;<a href="https://www.cdc.gov/mpox/causes/index.html">can spread mpox</a>&nbsp;virus, usually rodents and primates. Also, avoid sick or dead animals, as well as bedding or other materials they have touched.</p>',
          },
        ],
        id: 'f100ad55-90a5-415a-947f-ff97f074ac64',
      },
    ],
  },
]
