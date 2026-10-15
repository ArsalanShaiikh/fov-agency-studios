// The studio's own photos and clips for the home mosaic (src/assets/home).
// Photos ship as WebP (the .jpeg originals stay alongside, unused);
// each clip has a first-frame poster so its tile never flashes empty.
import redHouse from '../../assets/home/red-house.webp'
import storefront from '../../assets/home/storefront.webp'
import archwayNight from '../../assets/home/archway-night.webp'
import artStudioNight from '../../assets/home/art-studio-night.webp'
import nightTraffic from '../../assets/home/night-traffic.webp'
import crossing from '../../assets/home/crossing.mp4'
import crossingPoster from '../../assets/home/crossing-poster.webp'
import heritageStreet from '../../assets/home/heritage-street.mp4'
import heritageStreetPoster from '../../assets/home/heritage-street-poster.webp'
import sunset from '../../assets/home/marine-drive-sunset.mp4'
import sunsetPoster from '../../assets/home/marine-drive-sunset-poster.webp'
import trees from '../../assets/home/trees.mp4'
import treesPoster from '../../assets/home/trees-poster.webp'

export const IMAGES = {
  redHouse: { src: redHouse, alt: 'A red heritage house in Fort, Mumbai' },
  storefront: { src: storefront, alt: 'A heritage storefront on a Mumbai street' },
  archwayNight: { src: archwayNight, alt: 'A lit stone archway on a Mumbai street at night, a cyclist passing' },
  artStudioNight: { src: artStudioNight, alt: 'A corner art studio lit up at night in Mumbai' },
  nightTraffic: { src: nightTraffic, alt: 'Evening traffic under street lights along a tree-lined Mumbai road' },
}

export const VIDEOS = {
  crossing: { src: crossing, poster: crossingPoster },
  heritageStreet: { src: heritageStreet, poster: heritageStreetPoster },
  sunset: { src: sunset, poster: sunsetPoster },
  trees: { src: trees, poster: treesPoster },
}
