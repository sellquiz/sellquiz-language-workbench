<?php
/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/
?>

<div id="container" class="container-fluid p-0 m-0">
    <div class="row m-0 p-0">
        <div class="col text-center border-end border-bottom py-1" style="">
            <span data-bs-toggle="modal"
                data-bs-target="#insertCodeModal">
                <button id="insertCodeButton"
                    type="button" class="btn btn-dark mx-0 btn-sm"
                    data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="insert template [F3]">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </span>
            <div class="dropdown" style="display:inline-block"
                    data-bs-toggle="tooltip" data-bs-placement="top"
                    title="insert math symbol">
                <button class="btn btn-sm btn-dark dropdown-toggle"
                    type="button" id="" data-bs-toggle="dropdown"
                    onclick="hide_tooltips();">
                    &Sigma;
                </button>
                <div class="dropdown-menu">
                    <div id="math-symbols" class="yamm-content">
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="undo [Ctrl+Z]"
                onclick="hide_tooltips();slwEditor.undoEditor();">
                <i class="fas fa-undo"></i>
            </button>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="redo [Ctrl+Y]"
                onclick="hide_tooltips();slwEditor.redoEditor();">
                <i class="fas fa-redo"></i>
            </button>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="save [Ctrl+S]"
                onclick="hide_tooltips();slwEditor.saveDocument();">
                <i class="fas fa-hdd"></i>
            </button>
            &nbsp;&nbsp;&nbsp;
            <i class="fas fa-layer-group"></i>
            <div class="dropdown" style="display:inline-block"
                    data-bs-toggle="tooltip" data-bs-placement="top"
                    title="course selection">
                <button class="btn btn-sm btn-primary dropdown-toggle"
                    type="button" id="courselist_button" data-bs-toggle="dropdown"
                    onclick="hide_tooltips();">
                </button>
                <ul id="courselist_dropdown_items"class="dropdown-menu">
                </ul>
            </div>
            &nbsp;&nbsp;&nbsp;
            <i class="fas fa-file"></i>
            <div class="dropdown" style="display:inline-block"
                    data-bs-toggle="tooltip" data-bs-placement="top"
                    title="document selection">
                <button class="btn btn-sm btn-primary dropdown-toggle"
                    type="button" id="filelist_button" data-bs-toggle="dropdown"
                    onclick="hide_tooltips();">
                </button>
                <ul id="filelist_dropdown_items" class="dropdown-menu">
                </ul>
            </div>
        </div>
        <div class="col text-center border-end border-bottom py-1" style="">

            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
                <label class="btn btn-outline-primary btn-sm" for="btnradio1"
                    data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="desktop preview"
                    onclick="slwEditor.setDesktopMode();">
                    <i class="fa-solid fa-desktop"></i>
                </label>

                <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
                <label class="btn btn-outline-primary btn-sm" for="btnradio2"
                    data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="mobile preview"
                    onclick="slwEditor.setMobileMode();">
                    &nbsp;<i class="fa-solid fa-mobile-screen-button"></i>&nbsp;
                </label>
            </div>

            &nbsp;&nbsp;&nbsp;

            <button type="button" class="btn btn-success mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="fast update [F1]"
                onclick="hide_tooltips();slwEditor.updateEmulator(true);">
                <i class="fa-solid fa-forward-fast"></i>
            </button>
            <button type="button" class="btn btn-success mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="full update [F2]"
                onclick="hide_tooltips();slwEditor.updateEmulator(false);">
                <i class="fa-solid fa-play"></i>
            </button>

            &nbsp;&nbsp;&nbsp;

            <button id="preview-spell-check" type="button" class="btn btn-outline-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="spell check"
                onclick="hide_tooltips();slwEditor.toggleButton('preview-spell-check');">
                <i class="fas fa-spell-check"></i>
            </button>
            <button id="preview-show-source-links" type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="source links"
                onclick="hide_tooltips();slwEditor.toggleButton('preview-show-source-links');">
                <i class="fas fa-link"></i>
            </button>
            <button id="preview-show-solutions" type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="show solutions"
                onclick="hide_tooltips();slwEditor.toggleButton('preview-show-solutions');">
                <i class="fas fa-poll"></i>
            </button>
            <button id="preview-show-variables" type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="show variables"
                onclick="hide_tooltips();slwEditor.toggleButton('preview-show-variables');">
                <i class="fas fa-chevron-down"></i>
            </button>
            <button id="preview-show-export" type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="show 'export' buttons"
                onclick="hide_tooltips();slwEditor.toggleButton('preview-show-export');">
                <i class="fas fa-file-export"></i>
            </button>
        </div>
    </div>
</div>