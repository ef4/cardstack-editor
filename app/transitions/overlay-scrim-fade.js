import RSVP from 'rsvp';
import $ from 'jquery';
var Velocity = $.Velocity;

export default function() {
  let maxOpacity = 0.5;
  let promises = [];
  if (this.oldElement) {
    promises = promises.concat(Array.from(this.oldElement.find('>div')).map(
      elt => Velocity.animate(elt, { opacity: 0 })
    ));
  }
  if (this.newElement) {
    this.newElement.css({
      visibility: 'visible',
      display: ''
    });
    promises = promises.concat(Array.from(this.newElement.find('> div')).map(
      elt => Velocity.animate(elt, { opacity: [maxOpacity, 0]})
    ));
  }
  return RSVP.all(promises);
}
