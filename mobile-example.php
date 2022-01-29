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

        <!--<script src="node_modules/ui-progress-circle/dist/ui-progress-circle/ui-progress-circle.js">-->

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
            body {
                padding-top: 64px;
                /*background-color: #AAAAAA;*/
            }



        </style>

    </head>

    <body>

    <nav class="navbar navbar-expand-lg  navbar-dark bg-dark px-2 fixed-top">
  <a class="navbar-brand" href="#">andi &bull; 2135 &bull; <span style="color:#d4aa00;"><i class="fas fa-trophy"></i></span> &bull; <i class="fas fa-award"></i></a>
  <a class="navbar-brand" href="#"><img src="img/app-icon.png" alt="" height="28" class="d-inline-block align-text-top"></a>
  <!--<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
  </div>-->
</nav>

        <div class="container-fluid bg-white">
            <div class="row">
                <div class="col">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Grundlagen</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Komplexe Zahlen</li>
                        </ol>
                    </nav>
                    <div id="text-progress" class="progress">
                        <div class="progress-bar bg-dark" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Text</div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">Aufgaben</div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Spiele</div>
                    </div>
                    <div class="py-1">
                    </div>
                    <h1>Komplexe Zahlen</h1>
                    <h2>Einführung</h2>
                </div>
            </div>
        </div>

        <!-- TODO:
        <div class="container-fluid px-1 bg-white py-1">
            <ui-progress-circle></ui-progress-circle>
            <ui-progress-circle value="67"></ui-progress-circle>
            <ui-progress-circle value="100" color="success"></ui-progress-circle>
            <ui-progress-circle value="33" stroke="100"></ui-progress-circle>
            <ui-progress-circle shape="round" color="#2266DD" radius="90"></ui-progress-circle>
            <ui-progress-circle value="42" class="no-animation"></ui-progress-circle>
        </div>
        -->

        <!--
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
        -->

        <div class="container-fluid bg-white">
            <div class="row">
                <div class="col">
                    <p>Über den reellen Zahlen können Gleichungen wie `x^2 = −1` nicht gelöst werden, da keine Quadratwurzeln aus negativen Zahlen existieren.</p>
                </div>
                <div class="col-1 text-success">
                    <i class="far fa-smile-beam"></i>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p onclick="mark_read();">Deshalb erweitert man den Zahlbereich auf die sogenannten <b>komplexen Zahlen</b>, die wir später als Ausdrücke der Form `x+y\sqrt{-1}=x+y i` mit `x,y \in \mathbb{R}` darstellen werden.</p>
                </div>
                <div id="smiley" class="col-1 text-success">
                    <!--<i class="far fa-smile-beam"></i>-->
                </div>
            </div>
        </div>

        <div class="container-fluid bg-white" style="border-left-style:solid; border-right-style:solid; border-width:8px;">
            <div class="row">
                <div class="col py-1">
                    <p class="text-start lead py-0 mx-0 my-1"><b>Definition</b></p>
                    Auf dem `\mathbb{R}^2` definieren wir
                    <ul class="px-4">
                        <li>Die <b>Addition</b> durch `(x_1,y_1)+``(x_2,y_2)``=(x_1+x_2,y_1+y_2)`</li>
                        <li>Die <b>Multiplikation</b> `(x_1,y_1)\cdot``(x_2,y_2)``=(x_1 x_2-y_1 y_2,x_1 y_2+x_2 y_1)`</li>
                    </ul>
                    <!--<div class="col text-start">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>
                            < !--<button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>-- >
                        </div>
                    </div>-->
                </div>
            </div>
        </div>

        <div class="container-fluid bg-white">
            <div class="row">
                <div class="col py-1">
                    <p class="text-start lead py-0 mx-0 my-1"><b>Beispiel</b></p>
                    Sei `z_1=2+3i,` `z_2=-3+2i`. Dann gilt:
                    <ul class="px-4">
                        <li>`z_1+z_2`<br/>`=(2-3)+``(3+2i)`<br/>`=-1+5i`</li>
                        <li>`z_1-z_2`<br/>`=z_1+(-z_2)`<br/>`=2+3i+(3+(-2)i)`<br/>`=(2+3)+(3+(-2))i`<br/>`=5+i`</li>
                    </ul>
                </div>
            </div>
        </div>


        <div class="container-fluid px-1 py-2 bg-white" style="border-left-style:solid; border-right-style:solid; border-width:8px; border-color:#0000aa;">
            <p class="text-start lead py-0 mx-0"><b><i class="fas fa-question-circle"></i></b></p>
            Sei `z_1=2+3i,` `z_2=-3+2i`. Berechne<br/>
            <ul class="px-4">
                <li>
                    `z_1+z_2=`
                    <input id="input1" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `+`
                    <input id="input2" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `i`
                </li>
                <li>
                    `z_1-z_2=`
                    <input id="input3" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `+`
                    <input id="input4" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `i`
                </li>
            </ul>
            <!--<div class="col text-start">
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>
                    < !--<button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>-- >
                </div>
            </div>-->
        </div>

        <div class="container-fluid px-1 py-2 bg-white">
            <p class="text-start lead py-0 mx-0"><b>Praxis</b></p>
        </div>

        TODO: game (e.g. speed select correct answers (similar to memrize app))


        <script>
            let input = document.getElementById("input1");
            input.addEventListener('keyup', function(event){
                console.log(input.value.trim());
                if(input.value.trim() === '-1') {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#00aa00';
                    input.style.borderWidth = "medium";
                } else {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#aa0000';
                    input.style.borderWidth = "medium";
                }
            })

            function mark_read() {
                document.getElementById("smiley").innerHTML = '<i class="far fa-smile-beam"></i>';
                document.getElementById("text-progress").innerHTML =
                    '<div class="progress-bar bg-dark" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">Text</div>';
            }

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
