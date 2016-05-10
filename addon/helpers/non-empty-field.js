import Ember from 'ember';

export function nonEmptyField(params/*, hash*/) {
  return params;
}

export default Ember.Helper.helper(nonEmptyField);
