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

<div id="container" class="container-fluid p-0 m-0" style="height:100%;">
    <div class="row m-0 p-0" style="height:100%;">
        <div id="editor-content" class="col m-0 p-0 border-end w-100" style="height: 100%;">
            <textarea class="m-0 p-0 w-100" id="editor" style="width: 100%;"></textarea>
        </div>
        <div id="box"
            class="col m-0 p-0 border-end"
            style="display:none;">
            TODO
        </div>
        <div id="ticket"
            class="col m-0 p-0 border-end"
            style="display:none;">
            <table class="table table-sm m-1" style="width:auto;">
                <thead>
                    <tr>
                        <th scope="col">Ticket</th>
                        <th scope="col">Document</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Editor</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10000</td>
                        <td>hello.html</td>
                        <td>admin</td>
                        <td>admin</td>
                        <td>
                            <button type="button"
                                class="btn btn-primary btn-sm">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="card border border-dark m-1 p-1">
                <div class="card-body m-1 p-1">
                    <h5 class="card-title">admin &mdash; 2021-10-30 11:47:21</h5>
                    <p class="p-0 mx-0 my-1">Message Text...</p>
                    <p class="p-0 m-0">
                        <button type="button" class="btn btn-primary btn-sm">
                        <i class="fas fa-edit"></i>
                        </button>
                    </p>
                </div>
            </div>
        </div>
        <div id="document-tree"
            class="col m-0 p-0 border-end"
            style="display:none;">
            <table class="table table-sm m-1" style="width:auto;">
                <thead>
                    <tr>
                        <th scope="col">Filename</th>
                        <th scope="col">Ticket</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">hello.txt</th>
                        <td>10000</td>
                        <td>
                            <button type="button"
                                class="btn btn-primary btn-sm">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button type="button"
                                class="btn btn-primary btn-sm">
                                <i class="fas fa-italic"></i>
                            </button>
                            <button type="button"
                                class="btn btn-primary btn-sm">
                                <i class="fas fa-anchor"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="user-management"
            class="col m-0 p-0 border-end"
            style="display:none;">
            <table class="table table-sm m-1" style="width:auto;">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Mail</th>
                        <th scope="col">Last login</th>
                        <th scope="col"><i class="fas fa-user"></i></th>
                        <th scope="col"><i class="fas fa-sitemap"></i></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">admin</th>
                        <td>
                            Andreas Schwenk
                        </td>
                        <td>
                            andreas.schwenk@th-koeln.de
                        </td>
                        <td>
                            2021-10-30 10:41:52
                        </td>
                        <td>
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked>
                        </td>
                        <td>
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="bugs"
            class="col m-0 p-0 border-end"
            style="display:none;">
            TODO
        </div>
        <div id="lab"
            class="col m-0 p-0 border-end"
            style="display:none;">
            TODO
        </div>
        <div class="col m-0 p-0 border-end bg-secondary" style="height: 100%; overflow-y: scroll;">
            <div id="rendered-content" class="col p-2"></div>
        </div>
    </div>
</div>
