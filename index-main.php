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

            <span class="text-danger">UNIMPLEMENTED</span>

        </div>

        <div id="ticket"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <span class="text-danger">UNIMPLEMENTED</span>

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


        <div id="document-management"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <div class="border border-dark rounded m-3 p-2">
                <h2>Document Management</h2>
                <p>Selected course: <b><span id="document-management-selected-course"></span></b></p>
                <table class="table m-0" style="width:auto;">
                    <thead>
                        <tr>
                            <th scope="col">Order</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">State</th>
                            <th scope="col">Created</th>
                            <th scope="col">Modified</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="document-management-list">
                    </tbody>
                </table>

                <span data-bs-toggle="modal"
                    data-bs-target="#createDocumentModal">
                    <button type="button"
                        class="btn btn-primary btn-sm my-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="create a new document">Create Document
                    </button>
                </span>

                <br/>

                <div id="document-management-form" class="col-6 p-2 border border-secondary rounded" style="display:none;">
                    <div class="mb-3">
                        <label for="document-management-form-order" class="form-label">Order</label>
                        <input type="text" class="form-control" id="document-management-form-order">
                        <div class="form-text">Integer number</div>
                    </div>
                    <div class="mb-3">
                        <label for="document-management-form-name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="document-management-form-name" aria-describedby="emailHelp">
                        <div class="form-text">Must be an identifier (similar to a variable name in programming)</div>
                    </div>
                    <div class="mb-3">
                        <label for="document-management-form-description" class="form-label">Description</label>
                        <input type="text" class="form-control" id="document-management-form-description">
                    </div>
                    <button type="button"
                        class="btn btn-primary btn-sm my-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="save changes"
                        onclick="slwEditor.saveDocumentMetadata();">
                        Save
                    </button>
                    <button type="button"
                        class="btn btn-primary btn-sm my-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="discard changes"
                        onclick="slwEditor.cancelEditDocumentMetadata();">
                        Cancel
                    </button>
                </div>
            </div>
            <br/>

        </div>


        <div id="course-management"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <span class="text-danger">UNIMPLEMENTED</span>

            <div class="border border-dark rounded m-3 p-2">
                <h2>Course Management</h2>
                <table class="table m-1" style="width:auto;">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Created</th>
                            <th scope="col">Modified</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">demo</th>
                            <td>demo course</td>
                            <td>2022-02-16 00:00:00</td>
                            <td>2022-02-16 00:00:00</td>
                            <td>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="edit">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button"
                    class="btn btn-primary btn-sm my-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="create a new course">Create Course
                </button>
            </div>
            <br/>

        </div>


        <div id="server-management"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <span class="text-danger">UNIMPLEMENTED</span>

            <div class="border border-dark rounded m-3 p-2" >
                <h2>Server Management</h2>
                <table class="table m-1" style="width:auto;">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">test</th>
                            <td>test course</td>
                            <td>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="edit">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">production</th>
                            <td>production server</td>
                            <td>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="edit">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button type="button"
                                    class="btn btn-primary btn-sm"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button"
                    class="btn btn-primary btn-sm my-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="create a new server">Create Server
                </button>
            </div>
            <br/><br/>

        </div>


        <div id="user-management"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <span class="text-danger">UNIMPLEMENTED</span>

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

            <span class="text-danger">UNIMPLEMENTED</span>

        </div>

        <div id="lab"
            class="col m-0 p-0 border-end"
            style="display:none;">

            <span class="text-danger">UNIMPLEMENTED</span>

        </div>

        <div class="col m-0 p-0 border-end" style="height: 100%; overflow-y: scroll; background-color: #505050;">
            <div id="rendered-content" class="col p-2"></div>
        </div>
    </div>
</div>
