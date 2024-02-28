import { render, screen } from '@testing-library/react';
import { QaParagraph } from './'; // Adjust the import path as necessary

const qaParagraphProps = {
  id: 1,
  question: 'Sample Question',
  type: "paragraph--wysiwyg",
  answers: [
    {
      value: '<p>sample text 1</p>',
      format: 'rich_text',
      processed: 'sample text 1'
    },
    {
      value: '<p>sample text 2</p>',
      format: 'rich_text',
      processed: 'sample text 2'
    }
  ],
};

describe('<QaParagraph> component renders', () => {
  test('with valid data', () => {
    render(<QaParagraph {...qaParagraphProps} />);
    expect(screen.queryByText(/Sample Question/)).toBeInTheDocument();
    expect(screen.queryByText(/sample text 1/)).toBeInTheDocument();
    expect(screen.queryByText(/sample text 2/)).toBeInTheDocument();
  });
});

describe('<QaParagraph> component does not render', () => {
  test('without question and answers data', () => {
    const emptyProps = { ...qaParagraphProps, question: '', answers: [] };
    render(<QaParagraph {...emptyProps} />);
    expect(screen.queryByText(/Sample Question/)).not.toBeInTheDocument();
    expect(screen.queryByText(/sample text 1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/sample text 2/)).not.toBeInTheDocument();
  });
});
