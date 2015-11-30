/* global __DOTJS_TEMPLATE */
/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import Control from './control'
import SimpleSlider from '../lib/simple-slider'
import ColorPicker from '../lib/color-picker'

class FrameControl extends Control {
  /**
   * Entry point for this control
   */
  init () {
    let controlsTemplate = __DOTJS_TEMPLATE('../templates/operations/frame_controls.jst')
    this._controlsTemplate = controlsTemplate
    this._partialTemplates.slider = SimpleSlider.template
    this._partialTemplates.colorPicker = ColorPicker.template
  }

  _renderControls () {
    this._partialTemplates.colorPicker.additionalContext = { label: this._ui.translate('controls.frame.color') }

    super._renderControls()
  }

  /**
   * Gets called when this control is activated
   * @override
   */
  _onEnter () {
    this._operationExistedBefore = !!this._ui.operations.frame
    this._operation = this._ui.getOrCreateOperation('frame')

    this._initialOptions = {
      thickness: this._operation.getThickness(),
      color: this._operation.getColor()
    }

    this._ui.canvas.render()

    // Init slider
    let sliderElement = this._controls.querySelector('.pesdk-slider')
    this._slider = new SimpleSlider(sliderElement, {
      minValue: 0.0,
      maxValue: 0.5
    })
    this._slider.on('update', this._onThicknessUpdate.bind(this))
    this._slider.setValue(this._initialOptions.thickness)

    // Init colorpicker
    let colorPickerElement = this._controls.querySelector('.pesdk-color-picker')
    this._colorPicker = new ColorPicker(this._ui, colorPickerElement)
    this._colorPicker.on('update', this._onColorUpdate.bind(this))
    this._colorPicker.setValue(this._initialOptions.color)
  }

  /**
   * Gets called when the back button has been clicked
   * @override
   */
  _onBack () {
    if (this._operationExistedBefore) {
      this._operation.set(this._initialOptions)
    } else {
      this._ui.removeOperation('frame')
    }
    this._ui.canvas.render()
  }

  /**
   * Gets called when the thickness has been changed
   * @override
   */
  _onThicknessUpdate (value) {
    this._operation.setThickness(value)
    this._ui.canvas.render()
    this._highlightDoneButton()
  }

  /**
   * Gets called when the color has been changed
   * @override
   */
  _onColorUpdate (value) {
    this._operation.setColor(value)
    this._ui.canvas.render()
    this._highlightDoneButton()
  }

  /**
   * Gets called when the done button has been clicked
   * @override
   */
  _onDone () {
    this._ui.addHistory(this._operation, {
      color: this._initialOptions.color,
      thickness: this._initialOptions.thickness
    }, this._operationExistedBefore)
  }
}

/**
 * A unique string that identifies this control.
 * @type {String}
 */
FrameControl.prototype.identifier = 'frame'

export default FrameControl