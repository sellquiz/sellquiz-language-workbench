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

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Sellquiz Language Workbench</title>

        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="content-type" content="text/html; charset=utf-8">

        <script src="node_modules/jquery/dist/jquery.min.js" type="text/javascript"></script>
        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css"/>

        <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css"/>
        <script src="node_modules/codemirror/lib/codemirror.js"></script>
        <script src="node_modules/codemirror/addon/mode/simple.js"></script>
        <script src="node_modules/codemirror/addon/selection/active-line.js"></script>
        <script src="node_modules/codemirror/addon/mode/overlay.js"></script>

        <link rel="stylesheet" href="node_modules/codemirror-spell-checker/dist/spell-checker.min.css">
        <script src="node_modules/codemirror-spell-checker/dist/spell-checker.min.js"></script>

        <script src="node_modules/mathjs/lib/browser/math.js" type="text/javascript"></script>
        
        <script src="node_modules/sellquiz/build/js/sellquiz.min.js?version=<?php $date = date_create(); echo date_timestamp_get($date); ?>"></script>
        <script src="node_modules/sellquiz/build/js/sellquiz.ide.min.js?version=<?php $date = date_create(); echo date_timestamp_get($date); ?>"></script>

        <script src="dist/sellquiz-language-workbench.min.js"></script>

        <script>MathJax = { 
            loader: {
                load: ['input/asciimath', 'output/svg', 'ui/menu'] 
            },
            startup: {
                pageReady() {
                    return MathJax.startup.defaultPageReady().then(function () {
                        //alert("blub");
                        //MathJax.typesetPromise();
                    });
                }
            }
        };
        </script>

        <script type="text/javascript" id="MathJax-script" async src="node_modules/mathjax/es5/startup.js"></script>

        <style>
            body, html {
                margin: 0;
                height: calc(100% - 32px);
            }
            body{
                overflow: hidden;
            }
            /* visible tabs:   https://github.com/codemirror/CodeMirror/blob/master/demo/visibletabs.html  */
            .cm-tab {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
                background-position: right;
                background-repeat: no-repeat;
            }
        </style>

    </head>

    <body>

        <nav class="navbar my-0 p-0">
            <div class="container-fluid my-0 p-0">
                <div class="my-1"></div>
                <ul class="nav nav-tabs mx-1 my-0 p-0 w-100">
                    <li class="nav-item">
                        <a id="tab-editor" class="nav-link active"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="bottom" 
                            title="preview document" 
                            style="cursor:pointer;"
                            onclick="openTab('editor');">
                            <i class="fas fa-file-alt"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a id="tab-ticket" class="nav-link" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="bottom" 
                            title="ticket" 
                            style="cursor:pointer;"
                            onclick="openTab('ticket');">
                            <i class="fas fa-ticket-alt"></i>
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
                            title="report bugs" 
                            style="cursor:pointer;"
                            onclick="openTab('bugs');">
                            <i class="fas fa-bug"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a id="" class="nav-link disabled">
                            &emsp;&emsp;&emsp;&emsp;&emsp;
                            Sellquiz Language Workbench
                            &emsp;&emsp;&emsp;&emsp;&emsp;
                        </a>
                    </li>

                    <li class="nav-item">
                        <a id="" class="nav-link disabled text-primary">
                            <b>demo</b>   
                        </a>
                    </li>

                    <li class="nav-item">
                        <a id="" class="nav-link text-danger"
                            data-bs-toggle="tooltip" data-bs-placement="bottom" 
                            title="sign out" 
                            onclick="hide_tooltips();">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    </li>

                </ul>
            </div>
        </nav>

        <!--<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <span class="nav-link text-light m-0 p-0" href="#">
                                <img class="m-0 p-0" src="img/logo-inverse-small.png" height="40" alt="">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn btn-success mx-1" 
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="update [F1]" 
                                onclick="hide_tooltips();slw.update();">
                                <i class="fas fa-running"></i>
                            </button>
                        </li>
                        <li class="nav-item">
                            <span data-bs-toggle="modal" 
                                data-bs-target="#insertCodeModal">
                                <button id="insertCodeButton" 
                                    type="button" class="btn btn-primary mx-1"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="insert template [F2]">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </span>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn btn-primary mx-1"
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="undo [Ctrl+Z]" 
                                onclick="hide_tooltips();slw.undo();">
                                <i class="fas fa-undo"></i>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn btn-primary mx-1"
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="redo [Ctrl+Y]" 
                                onclick="hide_tooltips();slw.redo();">
                                <i class="fas fa-redo"></i>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="btn btn-primary mx-1"
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="save [Ctrl+S]" 
                                onclick="hide_tooltips();slw.save();">
                                <i class="fas fa-hdd"></i>
                            </button>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span id="filename">hello.txt</span>
                            </a>
                            <ul id="filelist" class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">hello.txt</a></li>
                                <li><a class="dropdown-item" href="#">another-file.txt</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="d-flex">
                        < !--<input class="form-control me-2" type="search"
                        placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit" onclick="alert('TODO');">Search</button>-- >
                        <a class="navbar-brand">admin</a>
                        <button type="button" class="btn btn-danger mx-1"
                            data-bs-toggle="tooltip" data-bs-placement="bottom" 
                            title="sign out" 
                            onclick="hide_tooltips();">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>

                    </form>
                </div>
            </div>
        </nav>-->

        <div class="modal fade" id="insertCodeModal" tabindex="-1" aria-labelledby="insertCodeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="insertCodeModalLabel">Insert Template at Cursor Position</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="insertCodeList" class="list-group">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="slw.editor.focus();">Close</button>
                    </div>
                    <!-- TODO: must also focus editor, if ESC key is pressed -->
                </div>
            </div>
        </div> 

        <div id="container" class="container-fluid p-0 m-0" style="height:100%;">
            <div class="row m-0 p-0" style="height:100%;">

                <div class="col my-1 mx-0 p-0" style="position: relative; float: left; height: 100%; /*overflow-y: scroll;*/">

                    <div id="editor-content" class="col-sm my-0 p-0">
                        <div class="row">
                            <div class="col my-1 mx-2">
                                <button type="button" class="btn btn-success mx-0 btn-sm" 
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="update [F1]" 
                                    onclick="hide_tooltips();slw.update();typeset();">
                                    <i class="fas fa-running"></i>
                                </button>
                                <span data-bs-toggle="modal" 
                                    data-bs-target="#insertCodeModal">
                                    <button id="insertCodeButton" 
                                        type="button" class="btn btn-primary mx-0 btn-sm"
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                        title="insert template [F2]">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                </span>
                                <button type="button" class="btn btn-primary mx-0 btn-sm"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="undo [Ctrl+Z]" 
                                    onclick="hide_tooltips();slw.undo();">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button type="button" class="btn btn-primary mx-0 btn-sm"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="redo [Ctrl+Y]" 
                                    onclick="hide_tooltips();slw.redo();">
                                    <i class="fas fa-redo"></i>
                                </button>
                                <button type="button" class="btn btn-primary mx-0 btn-sm"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="save [Ctrl+S]" 
                                    onclick="hide_tooltips();slw.save();">
                                    <i class="fas fa-hdd"></i>
                                </button>
                                <div class="dropdown" style="display:inline-block">
                                    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        hello.txt
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li><a class="dropdown-item" 
                                            style="cursor:pointer;">hello.txt</a></li>
                                        <li><a class="dropdown-item" 
                                            style="cursor:pointer;">another-file.txt</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <!--<div class="row m-0 p-0 border-bottom"></div>-->
                        
                        <div class="row w-100 h-100 bg-dark mx-0 px-0" style="height:100%;">
                            <div class="col w-100 mx-0 px-0" style="height: 600px;">
                                <textarea class="m-0 p-0 " id="editor"></textarea>
                            </div>
                        </div>

                    </div>

                    <div id="ticket"
                        class="col-sm m-2 p-0"
                        style="display:none;">
                        <table class="table table-sm" style="width:auto;">
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
                        class="col-sm m-2 p-0"
                        style="display:none;">
                        <table class="table table-sm" style="width:auto;">
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
                        class="col-sm m-2 p-0"
                        style="display:none;">
                        <table class="table table-sm" style="width:auto;">
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
                </div>

                <div class="col my-1 mx-0 p-0" style="position: relative; float: left; height: 100%; overflow-y: scroll;">
                    <div id="rendered-content"></div>
                </div>

                <!--<div class="col my-1 mx-0 p-0" style="position: relative; float: left; height: 100%; overflow-y: scroll;">
                    <div id="rendered-content"></div>
                </div>-->

            </div>
        </div>

    </body>

    <script>
        CodeMirror.defineSimpleMode("sellquiz-edit", {
            start: [
                {regex: /\%.*/, token: "comment"},
                {regex: /\#.*/, token: "keyword", sol: true},
            ],
            comment: [

            ],
            meta: {
                dontIndentStates: ["comment"],
                lineComment: "%"
            }
        });

        function openTab(id) {

            document.getElementById("editor-content").style.display = 
                id === "editor" ? "block" : "none";
            document.getElementById("ticket").style.display = 
                id === "ticket" ? "block" : "none";
            document.getElementById("document-tree").style.display = 
                id === "filetree" ? "block" : "none";
            document.getElementById("user-management").style.display = 
                id === "users" ? "block" : "none";

            document.getElementById("tab-editor").className = 
                id === "editor" ? "nav-link active" : "nav-link";
            document.getElementById("tab-ticket").className = 
                id === "ticket" ? "nav-link active" : "nav-link";
            document.getElementById("tab-filetree").className = 
                id === "filetree" ? "nav-link active" : "nav-link";
            document.getElementById("tab-users").className = 
                id === "users" ? "nav-link active" : "nav-link";
        }
    </script>

    <script>
        slw.init();

        setTimeout(function() {
                MathJax.typesetPromise();
        }, 3000);

        function typeset() {
            setTimeout(function() {
                MathJax.typesetPromise();
            }, 1000);
        }

        /*window.MathJax = {
            startup: {
                ready: () => {
                    console.log('MathJax is loaded, but not yet initialized');
                    MathJax.startup.defaultReady();
                    console.log('MathJax is initialized, and the initial typeset is queued');
                }
            }
        };*/

    </script>

    <script>
        // tooltip handling
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        function hide_tooltips() {
            for(let tooltip of tooltipList)
                tooltip.hide();
        }
    </script>

</html>
