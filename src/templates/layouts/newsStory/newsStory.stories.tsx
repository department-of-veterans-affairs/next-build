import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MediaImage } from '@/types/dataTypes/formatted/media'
import { NewsStory } from './index'

const mediaImage: MediaImage = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  link: {
    href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
    meta: {
      linkParams: {
        width: 700,
        height: 350,
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 700,
  height: 350,
  url: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
}

export default {
  title: 'Layouts/News Story',
  component: NewsStory,
} as ComponentMeta<typeof NewsStory>

const Template: ComponentStory<typeof NewsStory> = (args) => (
  <NewsStory {...args} />
)

export const Full = Template.bind({})
Full.args = {
  title: 'We honor outstanding doctors\n',
  image: mediaImage,
  caption:
    '"Caring for a single patient and solving that one patient\'s illness is our honor and privilege as health care providers." - Dr. Brooke Decker',
  author: {
    title: 'Keith Gottschalk',
  },
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  bodyContent:
    "VA Pittsburgh's Outstanding Physicians of the Year for 2019, Drs. Brooke Decker and Aref M. Rahman, stand out for expertly filling critical medical facility roles while fostering a collaborative spirit among staff in caring for Veterans.\n" +
    '\n' +
    'Dr. Decker, director of Infection Prevention, sees herself as a problem solver.\n' +
    '\n' +
    '"The problems that cause infections are incredibly varied and sometimes challenging," said Decker. "My job involves getting the right people together to help solve these problems."\n' +
    '\n' +
    'Recent examples include ensuring hand sanitizers are plentiful and optimally located to support hand hygiene; safe disposal of needles and syringes; and developing the safest way to shut down and perform maintenance on an air handler in a patient-care area that is always open.\n' +
    '\n' +
    "Dr. Rahman, a cardiologist, has been director of the Cardiac Cath Lab for the past six years. He credits his dedicated and skilled team for the lab's success, but he says one other factor plays a big role in that success.\n" +
    '\n' +
    '"The icing on top is the staff\'s eagerness to help our Veterans," said Rahman. "All hospital environments can be intense and demanding and come with general and specific challenges. But having co-workers whom one can count on makes my job at VA an invaluable opportunity."\n' +
    '\n' +
    'Decker said she likens her investigative work to that of the fictional private detective Sherlock Holmes or Dr. Gregory House, a fictional doctor who solved medical mysteries on television\'s "House" series.\n' +
    '\n' +
    '"For every issue, there may be layers and layers of additional clues to unravel," said Decker. "The \'aha moment\' when it all comes together is very gratifying."\n' +
    '\n' +
    'Even so, Decker says preventing illness in the first place is even more gratifying.\n' +
    '\n' +
    '"Caring for a single patient and solving that one patient\'s illness is our honor and privilege as health care providers," said Decker. "Preventing 10 patients from getting sick is even better, and that\'s what we strive to do in Infection Prevention."\n' +
    '\n' +
    "Rahman said he's been fascinated since childhood with how the human body works.\n" +
    '\n' +
    '"I would read all kinds of articles about new discoveries in medicine and I found myself being drawn more and more toward what is literally the \'heart\' of our bodies," he said. "Cardiology is not just a career choice, but a calling, and I think it found me."\n' +
    '\n' +
    "Both doctors said the best part of working at VA is listening to Veterans' stories.\n" +
    '\n' +
    '"I love sitting down at the bedside and hearing about someone\'s family, pets, adventures," said Decker. "I\'ve met some truly great people working at VA."\n' +
    '\n' +
    "Rahman said Veterans' stories make every day at work interesting.\n" +
    '\n' +
    '"As I interact with my patients, I get to hear a lot of fascinating stories of their experiences all over the world," said Rahman. "It\'s never a dull day at work."\n' +
    '\n' +
    "Decker and Rahman were formally recognized as Outstanding Physicians of the Year on April 26 during the medical staff's quarterly meeting at University Drive.",
  date: 'May 14, 2019',
  socialLinks: {
    path: '/foo',
    title: 'We honor outstanding doctors',
  },
  listing: '/pittsburgh-health-care/stories',
}
