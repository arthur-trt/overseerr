import { type IMDBRating } from '@server/api/rating/imdbRadarrProxy';
import { type RTRating } from '@server/api/rating/rottentomatoes';
import { type BechdelRating } from '@server/api/rating/bechdelProxy';

export interface RatingResponse {
  rt?: RTRating;
  imdb?: IMDBRating;
  bechdel?: BechdelRating;
}
