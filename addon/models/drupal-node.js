import DS from 'ember-data';
const { attr, Model } = DS;
import { pluralize } from 'ember-inflector';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import RelationshipTracker from 'cardstack-cms/mixins/relationship-tracker';

/*
  Base class for all the models that are stored as Drupal nodes
*/

export default Model.extend(RelationshipTracker, {
  router: inject(),
  tools: inject(),
  title: attr('string'),
  created: attr('date'),
  changed: attr('date'),
  published: attr('boolean'),
  deleted: attr('boolean'),
  publicationDate: attr('local-iso-8601'),

  prioritization: attr('prioritization', { editorial: true, editorialSortOrder: 10 }),
  featured: attr('boolean',              { editorial: true, editorialSortOrder: 20 }),
  membersOnly: attr('boolean',           { editorial: true, editorialSortOrder: 30 }),
  useOnHomepage: attr('boolean',         { editorial: true, editorialSortOrder: 35 }),
  description: attr('string',            { editorial: true, editorialSortOrder: 40 }),

  slug: computed('id', 'title', function() {
    return `${this.get('id')}-${(this.get('title') || '').replace(/ /g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
  }),

  pageComponent: computed(function() {
    return `content-pages/${this.get('type')}-page`;
  }),

  cardComponent: computed(function() {
    return `cards/${this.get('type')}-card`;
  }),

  type: computed(function() {
    return this.constructor.modelName;
  }),

  hasPage: computed(function() {
    return !tileOnlyContentTypes.contains(this.get('type'));
  }),

  visit: computed(function () {
    return (event) => {
      if (event) { event.preventDefault(); }
      if (!this.get('tools.editing') && !this.get('hasPage')) {
        let url = this.get('linkUrl');
        if (this.get('isExternalLink') && url) {
          window.open(url);
        } else if (url) {
          this.get('router').transitionToURL(url);
        }
      } else if (this.get('tools.previewMode') !== 'tile') {
        this.get('router').transitionTo('content-page', [
          pluralize(this.get('type')),
          this.get('slug')
        ]);
        if (!this.get('hasPage')) {
          this.get('tools.preview')('tile');
        }
      }
    };
  }),

  editorVisit: computed(function() {
    return () => {
      this.get('router').transitionTo('content-page', [
        pluralize(this.get('type')),
        this.get('slug')
      ]);
      if (!this.get('hasPage')) {
        this.get('tools.preview')('tile');
      }
    };
  })

});

// This is the list of types that are directly managed by the
// user. There are other types too, like "image", that are implemented
// as Drupal content but that we present via other workflows.
//
// TODO: generate this by tagging the individual models and
// introspecting them.
export const userContentTypes = [
  'article',
  'award',
  'best-practice',
  'call-to-action',
  'contract-document',
  'course',
  'event',
  'page',
  'issue',
  'partner',
  'press-release',
  'resource',
  'showcase'
];

export const tileOnlyContentTypes = [
  'call-to-action',
  'contract-document',
  'course'
];
