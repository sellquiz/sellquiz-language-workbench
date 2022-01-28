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
        <title>Math App</title>

        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">


        <meta http-equiv="content-type" content="text/html; charset=utf-8">

        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="node_modules/@geedmo/yamm/dist/yamm.css"/>
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css"/>
        <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css"/>

        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="node_modules/mathjs/lib/browser/math.js"></script>

        <script>MathJax = {
            loader: {
                load: ['input/asciimath', 'output/svg', 'ui/menu']
            }
        };
        </script>

        <script type="text/javascript" id="MathJax-script" async src="node_modules/mathjax/es5/startup.js"></script>

        <style>
            html {
               font-size: 15px;
            }
            body { padding-top: 64px; }
            /*body, html {
                margin: 0;
                height: calc(100% - 46px);
            }
            body{
                overflow: hidden;
            }
            / * visible tabs:   https://github.com/codemirror/CodeMirror/blob/master/demo/visibletabs.html  * /
            .cm-tab {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
                background-position: right;
                background-repeat: no-repeat;
            }*/
        </style>

    </head>

    <body>

    <nav class="navbar navbar-expand-lg navbar-light bg-light px-2 fixed-top">
  <a class="navbar-brand" href="#">andi &bull; 2135 &bull; <span style="color:#d4aa00;"><i class="fas fa-trophy"></i></span> &bull; <i class="fas fa-award"></i></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>



        <div class="container-fluid px-1">
            <h1>Komplexe Zahlen</h2>
        </div>

        <div class="container-fluid px-1">
            <div class="text-center">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                        <li class="page-item"><a class="page-link" href="#">Einführung</a></li>
                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="container-fluid px-1 py-2">

            <div class="px-2" style="border-top-style: solid; border-bottom-style: solid; border-color: #c30000; border-radius: 10px;">
                <b>Definition</b> Auf dem `\mathbb{R}^2` definieren wir

                <!--<div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                    Die <b>Addition</b> durch `(x_1,y_1)+``(x_2,y_2)`<br/>`=(x_1+x_2,y_1+y_2)`.
                </div>
                <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                    Die <b>Multiplikation</b> `(x_1,y_1)\cdot``(x_2,y_2)`<br/>`=(x_1 x_2-y_1 y_2,x_1 y_2+x_2 y_1)`.
                </div>-->

                <ul>
                    <li>Die <b>Addition</b> durch `(x_1,y_1)+``(x_2,y_2)``=(x_1+x_2,y_1+y_2)`</li>
                    <li>Die <b>Multiplikation</b> `(x_1,y_1)\cdot``(x_2,y_2)``=(x_1 x_2-y_1 y_2,x_1 y_2+x_2 y_1)`</li>
                </ul>

            </div>

        </div>

        <div class="container-fluid text-end">
            <i class="fas fa-bookmark"></i> <!-- TODO: popup "bookmark" -->
        </div>



        <div class="container-fluid px-1 py-2">
            <b>Beispiel</b>
            Sei `z_1=2+3i,` `z_2=-3+2i`. <br/>Dann gilt:
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1+z_2`<br/>`=(2-3)+``(3+2i)`<br/>`=-1+5i`
            </div>
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1-z_2`<br/>`=z_1+(-z_2)`<br/>`=2+3i+(3+(-2)i)`<br/>`=(2+3)+(3+(-2))i`<br/>`=5+i`
            </div>

        </div>

        <div class="container-fluid px-2 py-2 bg-dark text-white">
            <!--<div class="px-2" style="border-top-style: solid; border-bottom-style: solid; border-color: #0f0f0f;">-->

                <b style="font-size:18pt;"><i class="fas fa-question-circle"></i></b>
                Sei `z_1=2+3i,` `z_2=-3+2i`. <br/>
                <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                    `z_1+z_2=`
                        <input id="input1" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                        `+`
                        <input id="input2" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                        `i`
                </div>
                <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                    `z_1-z_2=`
                        <input id="input3" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                        `+`
                        <input id="input4" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                        `i`
                </div>

            <!--</div>-->

            <div class="text-end">
                <i class="fas fa-sync"></i>
            </div>

        </div>



        <div class="container-fluid px-1 py-2">
            <b>Praxis</b>
        </div>


        <script>
            let input = document.getElementById("input1");
            input.addEventListener('keyup', function(event){
                console.log(input.value.trim());
                if(input.value.trim() === '-1') {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#00aa00';
                    input.style.borderWidth = "thick";
                } else {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#aa0000';
                    input.style.borderWidth = "thick";
                }
            })
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

    </body>

</html>
