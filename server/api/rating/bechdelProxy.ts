import ExternalAPI from '@server/api/externalapi';
import cacheManager from '@server/lib/cache';

type BechdelProxyResponse = BechdelMovie;

interface BechdelMovie {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
  title: string;
  id: number;
  imdbid: string;
  rating: number;
  message: string;
}

export interface BechdelRating {
  title: string;
  exist: boolean;
  url: string;
  rating: number;
}

/**
 * Use of https://github.com/arthur-trt/bechdelproxy
 * to limit use of the https://bechdeltest.com/ community API
 */
class BechdelProxy extends ExternalAPI {
  constructor() {
    super('https://bechdelproxy.k3s.arthur-trt.fr', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      nodeCache: cacheManager.getCache('bechdel').data,
    });
  }

  /**
   * Ask Bechdel Proxy for the film score
   *
   * @param IMDBid Id of IMDB movie
   */
  public async getMovieRatings(IMDBid: string): Promise<BechdelRating | null> {
    try {
      const data = await this.get<BechdelProxyResponse>(
        `/imdb/${IMDBid}`,
        { validateStatus: null }
      );

      if (data?.message == "Movie not in database") {
        return {
          title: data.title,
          url: `https://bechdeltest.com/add/`,
          exist: false,
          rating: 0,
        }
      }

      return {
        title: data.title,
        url: `http://bechdeltest.com/view/${data.id}`,
        rating: data.rating,
        exist: true
      };
    } catch (e) {
      throw new Error(
        `[IMDB RADARR PROXY API] Failed to retrieve movie ratings: ${e.message}`
      );
    }
  }
}

export default BechdelProxy;
