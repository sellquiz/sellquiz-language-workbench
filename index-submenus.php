<?php
/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2021 TH Köln                                            *
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
                    title="insert template [F2]">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </span>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="undo [Ctrl+Z]" 
                onclick="hide_tooltips();slw.undo();">
                <i class="fas fa-undo"></i>
            </button>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="redo [Ctrl+Y]" 
                onclick="hide_tooltips();slw.redo();">
                <i class="fas fa-redo"></i>
            </button>
            <button type="button" class="btn btn-dark mx-0 btn-sm"
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="save [Ctrl+S]" 
                onclick="hide_tooltips();slw.save();">
                <i class="fas fa-hdd"></i>
            </button>
            <div class="dropdown" style="display:inline-block"
                    data-bs-toggle="tooltip" data-bs-placement="top" 
                    title="select course">
                <button class="btn btn-sm btn-primary dropdown-toggle" 
                    type="button" id="courselist_button" data-bs-toggle="dropdown"
                    onclick="hide_tooltips();">
                    <!--demo-->
                </button>
                <ul id="courselist_dropdown_items"class="dropdown-menu">
                    <!--<li><a class="dropdown-item" 
                        style="cursor:pointer;">demo</a></li>-->
                </ul>
            </div>
            <div class="dropdown" style="display:inline-block"
                    data-bs-toggle="tooltip" data-bs-placement="top" 
                    title="select file">
                <button class="btn btn-sm btn-primary dropdown-toggle"
                    type="button" id="filelist_button" data-bs-toggle="dropdown"
                    onclick="hide_tooltips();">
                    <!--demo.txt-->
                </button>
                <ul id="filelist_dropdown_items" class="dropdown-menu">
                    <!--<li><a class="dropdown-item" 
                        style="cursor:pointer;">demo.txt</a></li>-->
                </ul>
            </div>
        </div>
        <div class="col text-center border-end border-bottom py-1" style="">
            <button type="button" class="btn btn-success mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="update [F1]" 
                onclick="hide_tooltips();slw.update();typeset();">
                <i class="fas fa-running"></i>
            </button>
            <button id="preview-spell-check" type="button" class="btn btn-dark mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="spell check" 
                onclick="hide_tooltips();slw.toggle('preview-spell-check');">
                <i class="fas fa-spell-check"></i>
            </button>
            <button id="preview-show-source-links" type="button" class="btn btn-dark mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="source links" 
                onclick="hide_tooltips();slw.toggle('preview-show-source-links');">
                <i class="fas fa-link"></i>
            </button>
            <button id="preview-show-solutions" type="button" class="btn btn-dark mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="show solutions" 
                onclick="hide_tooltips();slw.toggle('preview-show-solutions');">
                <i class="fas fa-poll"></i>
            </button>
            <button id="preview-show-variables" type="button" class="btn btn-dark mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="show variables" 
                onclick="hide_tooltips();slw.toggle('preview-show-variables');">
                <i class="fas fa-chevron-down"></i>
            </button>
            <button id="preview-show-export" type="button" class="btn btn-dark mx-0 btn-sm" 
                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="show 'export' buttons" 
                onclick="hide_tooltips();slw.toggle('preview-show-export');">
                <i class="fas fa-file-export"></i>
            </button>
        </div>
    </div>
</div>