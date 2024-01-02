import styled from 'styled-components';

const Styles = {
  Box: styled.div<{
    $focusBorderColor: string;
    $focused: boolean;
  }>`
    max-width: 956px;
    padding: 16px 8px 8px;
    border-radius: 4px;
    box-shadow:
      ${(props) =>
          props.$focused && `0 0 0 1px ${props.$focusBorderColor} inset,`}
        0 1px 5px 0 rgba(13, 13, 13, 0.12),
      0 0 1px 0 rgba(13, 13, 13, 0.16),
      0 2px 2px 0 rgba(13, 13, 13, 0.08);
  `,
};

export default Styles;
