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

<div class="container-fluid m-0 p-0 bg-dark">
    <div class="row my-0">
        <div class="col my-1">
        </div>
    </div>
    <div class="row m-0 p-0 w-100">
        <div class="col m-0 p-0 w-100">
            <ul class="nav nav-tabs m-0 p-0 w-100 bg-dark">
                <li class="nav-item">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </li>
                <li class="nav-item">
                    <span data-bs-toggle="modal"
                        data-bs-target="#modal-login">
                        <button id="login"
                            type="button" class="btn btn-success mx-0 btn-sm"
                            data-bs-toggle="tooltip" data-bs-placement="bottom"
                            title="login">
                            <?php
                                $user = $_SESSION['slw_user'];
                                if(strcmp($user, "demo") == 0)
                                    echo "<i class=\"fas fa-sign-in-alt\"></i>";
                                else
                                    echo $user;
                            ?>
                        </button>
                    </span>
                </li>
                <li class="nav-item">
                    <button id="logout"
                        type="button" class="btn btn-danger mx-1 btn-sm"
                        data-bs-toggle="tooltip" data-bs-placement="bottom"
                        title="logout"
                        onclick="window.location.href='services/logout.php';">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </li>
                <li class="nav-item">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </li>
                <li class="nav-item">
                    <a id="tab-editor" class="nav-link active"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="edit document"
                        style="cursor:pointer;"
                        onclick="openTab('editor');">
                        <i class="fas fa-file-alt"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-box" class="nav-link"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="edit box"
                        style="cursor:pointer;"
                        onclick="openTab('box');">
                        <i class="fa-solid fa-table-cells-large"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-ticket" class="nav-link"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="ticket"
                        style="cursor:pointer;"
                        onclick="openTab('ticket');">
                        <i class="fa-solid fa-ticket"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-filetree" class="nav-link"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="file tree"
                        style="cursor:pointer;"
                        onclick="openTab('filetree');">
                        <i class="fas fa-sitemap"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-users" class="nav-link"
                    data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="user management"
                        style="cursor:pointer;"
                        onclick="openTab('users');">
                        <i class="fas fa-user"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-bugs" class="nav-link"
                    data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="bug reporting"
                        style="cursor:pointer;"
                        onclick="openTab('bugs');">
                        <i class="fas fa-bug"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a id="tab-lab" class="nav-link"
                    data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="lab management"
                        style="cursor:pointer;"
                        onclick="openTab('lab');">
                        <i class="fa-solid fa-flask"></i>
                    </a>
                </li>

            </ul>
        </div>
        <div class="col m-0 p-0 text-end border-bottom text-secondary">
            <span class="lead fw-lighter" style="cursor:default;">Sellquiz Language Workbench</span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
    </div>
</div>