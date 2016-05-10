import Helper from 'ember-helper';

// TODO: how does an addon access the parent app's config?
const environment = 'development';

export default Helper.extend({
  compute(messages) {
    if (environment === 'production') {
      return;
    }

    let message = messages.join(' ');
    if (environment === 'development') {
      return message;
    }

    throw new Error(message);
  }
});
