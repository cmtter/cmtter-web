import button from './button'
import card from './card'
import contaner from './contaner'
import div from './div'
import span from './span'
import dropdown from './dropdown'
import form from './form'
import input from './input'
import modal from './modal'
import select from './select'
import treeselect from './treeselect'
import table from './table'
import tabs from './tabs'
import tree from './tree'
import upload from './upload'

export default {
  [button.tag]: {
    title: button.tagText,
    design: button
  },
  [card.tag]: {
    title: card.tagText,
    design: card
  },
  [contaner.tag]: {
    title: contaner.tagText,
    design: contaner
  },
  [div.tag]: {
    title: div.tagText,
    design: div
  },
  [span.tag]: {
    title: span.tagText,
    design: span
  },
  [dropdown.tag]: {
    title: dropdown.tagText,
    design: dropdown
  },
  [form.tag]: {
    title: form.tagText,
    design: form
  },
  [input.tag]: {
    title: input.tagText,
    design: input
  },
  [modal.tag]: {
    title: modal.tagText,
    design: modal
  },
  [select.tag]: {
    title: select.tagText,
    design: select
  },
  [treeselect.tag]: {
    title: treeselect.tagText,
    design: treeselect
  },
  [table.tag]: {
    title: table.tagText,
    design: table
  },
  [tabs.tag]: {
    title: tabs.tagText,
    design: tabs
  },
  [tree.tag]: {
    title: tree.tagText,
    design: tree
  },
  [upload.tag]: {
    title: upload.tagText,
    design: upload
  }
}