import { IMAGE_FRAGMENT } from './asset';

export const YT_VIDEO_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  title
  youTubeUrl
  thumbnail {
    ${IMAGE_FRAGMENT}
  }
`;
