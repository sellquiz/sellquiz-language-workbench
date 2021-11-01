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

<?php
    session_start();
    if(isset($_SESSION['slw_user']) == false)
        $_SESSION['slw_user'] = 'demo';
    if(isset($_SESSION['slw_error']) == false)
        $_SESSION['slw_error'] = '';
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

        <script src="dist/sellquiz-language-workbench.min.js?version=<?php $date = date_create(); echo date_timestamp_get($date); ?>"></script>

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
                height: calc(100% - 46px);
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
                            <a id="logout" 
                                type="button" class="btn btn-danger mx-1 btn-sm"
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="logout"
                                href="services/logout.php">
                                <i class="fas fa-sign-out-alt"></i>
                            </a>
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
                                <i class="fas fa-th-large"></i>
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
                    </ul>
                </div>
                <div class="col m-0 p-0 text-end border-bottom text-secondary">
                    <span class="lead fw-lighter" style="cursor:default;">Sellquiz Language Workbench</span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        </div>

        <div class="modal" id="modal-error" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Error</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><?php echo $_SESSION['slw_error']; ?></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>

        <div class="modal" id="modal-login" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form action="services/login.php" method="post">
                        <div class="modal-header">
                            <h5 class="modal-title">Login</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    @
                                </span>
                                <input id="login-user" name="login-user" type="text" class="form-control" 
                                    placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-key"></i>
                                </span>
                                <input id="login-password" name="login-password" type="password" class="form-control" 
                                    placeholder="Password" aria-label="Password" aria-describedby="basic-addon1">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <span data-bs-toggle="modal" 
                                data-bs-target="#modal-register">
                                <button id="register" 
                                    type="button" class="btn btn-danger mx-0"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                    title="No account? register here!">
                                    Register
                                </button>
                            </span>
                            <button type="submit" class="btn btn-success">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal" id="modal-register" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form action="services/register.php" method="post">
                        <div class="modal-header">
                            <h5 class="modal-title">Register</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-lock-open"></i>
                                </span>
                                <input id="register-access" name="register-access" type="password" class="form-control" 
                                    placeholder="Access Password" aria-label="Password" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    @
                                </span>
                                <input id="register-user" name="register-user" type="text" class="form-control" 
                                    placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-users"></i>
                                </span>
                                <input id="register-name" name="register-name" type="text" class="form-control" 
                                    placeholder="Full name" aria-label="Name" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-envelope"></i>
                                </span>
                                <input id="register-mail" name="register-mail" type="text" class="form-control" 
                                    placeholder="Mail address" aria-label="Mail" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-key"></i>
                                </span>
                                <input id="register-password-1" name="register-password-1" type="password" class="form-control" 
                                    placeholder="User Password (at least 8 characters)" aria-label="Password" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1" style="width:50px;">
                                    <i class="fas fa-key"></i>
                                </span>
                                <input id="register-password-2" name="register-password-2" type="password" class="form-control" 
                                    placeholder="Repeat User Password" aria-label="Password" aria-describedby="basic-addon1">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

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
            <div class="row m-0 p-0">
                <div class="col text-center border-end border-bottom py-1" style="">
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
                <div class="col text-center border-end border-bottom py-1" style="">
                    <button type="button" class="btn btn-dark mx-0 btn-sm" 
                        data-bs-toggle="tooltip" data-bs-placement="bottom" 
                        title="spell check" 
                        onclick="">
                        <i class="fas fa-spell-check"></i>
                    </button>
                    <button type="button" class="btn btn-dark mx-0 btn-sm" 
                        data-bs-toggle="tooltip" data-bs-placement="bottom" 
                        title="source links" 
                        onclick="">
                        <i class="fas fa-link"></i>
                    </button>
                    <button type="button" class="btn btn-dark mx-0 btn-sm" 
                        data-bs-toggle="tooltip" data-bs-placement="bottom" 
                        title="show solutions" 
                        onclick="">
                        <i class="fas fa-poll"></i>
                    </button>
                    <button type="button" class="btn btn-dark mx-0 btn-sm" 
                        data-bs-toggle="tooltip" data-bs-placement="bottom" 
                        title="show variables" 
                        onclick="">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
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
                <div class="col m0 p-0 border-end" style="height: 100%; overflow-y: scroll;">
                    <div id="rendered-content"></div>
                </div>
            </div>
        </div>

    </body>

    <script>
        CodeMirror.defineSimpleMode("sellquiz-edit", {
            start: [
                {regex: /\%.*/, token: "comment"},
                {regex: /\#.*/, token: "keyword", sol: true},
                {regex: /Definition.|Theorem.|Sell.|Stack.|Remark.|JavaBlock.|Tikz.|Plot2d./, token: "keyword"},
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
            document.getElementById("box").style.display = 
                id === "box" ? "block" : "none";
            document.getElementById("ticket").style.display = 
                id === "ticket" ? "block" : "none";
            document.getElementById("document-tree").style.display = 
                id === "filetree" ? "block" : "none";
            document.getElementById("user-management").style.display = 
                id === "users" ? "block" : "none";
            document.getElementById("bugs").style.display = 
                id === "bugs" ? "block" : "none";

            document.getElementById("tab-editor").className = 
                id === "editor" ? "nav-link active" : "nav-link";
            document.getElementById("tab-box").className = 
                id === "box" ? "nav-link active" : "nav-link";
            document.getElementById("tab-ticket").className = 
                id === "ticket" ? "nav-link active" : "nav-link";
            document.getElementById("tab-filetree").className = 
                id === "filetree" ? "nav-link active" : "nav-link";
            document.getElementById("tab-users").className = 
                id === "users" ? "nav-link active" : "nav-link";
            document.getElementById("tab-bugs").className = 
                id === "bugs" ? "nav-link active" : "nav-link";
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

        function resize() {
            //let editorElement = document.getElementById("editor-div");
            //editorElement.style.height = "" + (window.innerHeight - 100) + "px";
        }

        window.addEventListener('resize', function(event) {
            resize();
        }, true);

        window.addEventListener('load', function () {
            resize();
        });

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

    <?php
        if(strlen($_SESSION['slw_error']) > 0) {
            echo("
                <script>
                    var errorModal = new bootstrap.Modal(document.getElementById(\"modal-error\"), {});
                    document.onreadystatechange = function () {
                        errorModal.show();
                    };
                </script>            
            ");
            $_SESSION['slw_error'] = "";
        }
    ?>

</html>
