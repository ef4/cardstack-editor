import RSVP from 'rsvp';

export default function() {
  let timer, frame;
  let promise = new RSVP.Promise(resolve => {
    if (typeof requestAnimationFrame === 'undefined') {
      timer = setTimeout(resolve, 33);  // 33ms is 30hz
    } else {
      frame = requestAnimationFrame(resolve);
    }
  });
  promise.__ec_cancel__ = () => {
    if (timer != null) {
      clearTimeout(timer);
    } else {
      cancelAnimationFrame(frame);
    }
  };
  return promise;
}
