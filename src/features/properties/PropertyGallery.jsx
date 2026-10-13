export function PropertyGallery({ property, details }) {
  if (!details.image) {
    return <div className="property-gallery-empty"><span>{property.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><strong>Gallery ready for photos</strong><small>Add venue photography when it becomes available.</small></div>;
  }

  const labels = ["Full venue", "Ceremony setting", "Guest experience"];
  return <div className="property-gallery" aria-label={`${property.name} gallery`}>
    {details.galleryFocus.map((position, index) => <figure key={position}><img src={details.image} alt={`${property.name} — ${labels[index].toLowerCase()}`} style={{ objectPosition: position }} /><figcaption>{labels[index]}</figcaption></figure>)}
  </div>;
}
