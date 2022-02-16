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

        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="node_modules/@geedmo/yamm/dist/yamm.css"/>
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css"/>
        <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css"/>

        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="node_modules/mathjs/lib/browser/math.js"></script>
        <script src="extern/nspell.min.js"></script>

        <script src="dist/slwEditor.min.js?version=<?php echo time();?>"></script>

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
        <?php include('index-modals.php') ?>
        <?php include('index-menu.php') ?>
        <?php include('index-submenus.php') ?>
        <?php include('index-main.php') ?>

        <script>

            function openTab(id) {
                // TODO: move code to "src/"
                document.getElementById("editor-content").style.display =
                    id === "editor" ? "block" : "none";
                document.getElementById("box").style.display =
                    id === "box" ? "block" : "none";
                document.getElementById("ticket").style.display =
                    id === "ticket" ? "block" : "none";

                document.getElementById("document-management").style.display =
                    id === "document-management" ? "block" : "none";
                document.getElementById("course-management").style.display =
                    id === "course-management" ? "block" : "none";
                document.getElementById("server-management").style.display =
                    id === "server-management" ? "block" : "none";

                document.getElementById("user-management").style.display =
                    id === "users" ? "block" : "none";
                document.getElementById("bugs").style.display =
                    id === "bugs" ? "block" : "none";
                document.getElementById("lab").style.display =
                    id === "lab" ? "block" : "none";

                document.getElementById("tab-editor").className =
                    id === "editor" ? "nav-link active" : "nav-link";
                document.getElementById("tab-box").className =
                    id === "box" ? "nav-link active" : "nav-link";
                document.getElementById("tab-ticket").className =
                    id === "ticket" ? "nav-link active" : "nav-link";

                document.getElementById("tab-document-management").className =
                    id === "document-management" ? "nav-link active" : "nav-link";
                document.getElementById("tab-course-management").className =
                    id === "course-management" ? "nav-link active" : "nav-link";
                document.getElementById("tab-server-management").className =
                    id === "server-management" ? "nav-link active" : "nav-link";

                document.getElementById("tab-users").className =
                    id === "users" ? "nav-link active" : "nav-link";
                document.getElementById("tab-bugs").className =
                    id === "bugs" ? "nav-link active" : "nav-link";
                document.getElementById("tab-lab").className =
                    id === "lab" ? "nav-link active" : "nav-link";

                if(id==='document-management') {
                    slwEditor.refreshDocumentManagement();
                }
            }
        </script>

        <script>
            slwEditor.init();

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

    </body>

</html>
