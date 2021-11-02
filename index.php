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
        <script src="node_modules/codemirror/mode/clike/clike.js"></script>
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
        <?php include('index-modals.php') ?>
        <?php include('index-menu.php') ?>
        <?php include('index-submenus.php') ?>
        <?php include('index-main.php') ?>
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
