export const PROPERTY_DETAILS = {
  gulmohar: {
    image: "./venue-images/gulmohar-gardens.jpg",
    tagline: "A garden celebration framed by old Delhi trees and warm sandstone architecture.",
    description: "Gulmohar Gardens pairs a generous open lawn with a ceremonial courtyard, making it easy to host a daytime mehendi, sunset pheras, and an evening reception without changing venues.",
    spaces: ["Main celebration lawn", "Ceremony courtyard", "Bridal suite", "Covered dining pavilion"],
    established: "2014",
    setting: "Garden estate",
    galleryFocus: ["50% 52%", "22% 46%", "78% 58%"],
  },
  haveli: {
    image: "./venue-images/royal-haveli.jpg",
    tagline: "An intimate heritage courtyard with the warmth and detail of old Jaipur.",
    description: "The Royal Haveli is designed for celebrations that value character over scale. Carved arcades, an illuminated central court, and guest rooms create an easy destination-wedding flow.",
    spaces: ["Heritage courtyard", "Arcade lounge", "Rooftop terrace", "Guest suites"],
    established: "2018",
    setting: "Heritage haveli",
    galleryFocus: ["50% 48%", "20% 50%", "80% 50%"],
  },
  lakeview: {
    image: "./venue-images/lakeview-lawns.jpg",
    tagline: "A serene lakeside lawn for destination weddings with an unmistakable Udaipur backdrop.",
    description: "Lakeview Lawns offers a wide waterfront setting suited to large guest lists, sunset ceremonies, and multi-day celebrations, with flexible outdoor zones and nearby guest accommodation.",
    spaces: ["Waterfront lawn", "Sunset mandap deck", "Welcome courtyard", "Guest arrival lounge"],
    established: "2016",
    setting: "Lakeside lawn",
    galleryFocus: ["50% 52%", "18% 48%", "82% 54%"],
  },
};

export function getPropertyDetails(property) {
  return PROPERTY_DETAILS[property.id] || {
    image: "",
    tagline: `A flexible celebration venue in ${property.city}.`,
    description: `${property.name} can host weddings and related events for up to ${property.capacity.toLocaleString("en-IN")} guests. Add photography and a richer venue description as the portfolio grows.`,
    spaces: ["Main event space"],
    established: "—",
    setting: "Wedding venue",
    galleryFocus: [],
  };
}
