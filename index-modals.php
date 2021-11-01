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

<div class="modal" id="modal-error" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Error</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            @
                        </span>
                        <input id="login-user" name="login-user" type="text" class="form-control" 
                            placeholder="Username">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-key"></i>
                        </span>
                        <input id="login-password" name="login-password" type="password" class="form-control" 
                            placeholder="Password">
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
                            Registration
                        </button>
                    </span>
                    <button type="submit" class="btn btn-success">Submit</button>
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
                    <h5 class="modal-title">Registration</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-lock-open"></i>
                        </span>
                        <input id="register-access" name="register-access" type="password" class="form-control"
                            placeholder="Access Password">
                        <span>
                            <button
                                type="button" class="btn btn-success mx-0 btn"
                                data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                title="validate access password">
                                validate
                            </button>
                        </span>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            @
                        </span>
                        <input id="register-user" name="register-user" type="text" class="form-control" 
                            placeholder="Username" disabled>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-users"></i>
                        </span>
                        <input id="register-name" name="register-name" type="text" class="form-control" 
                            placeholder="Full name" disabled>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <input id="register-mail" name="register-mail" type="text" class="form-control" 
                            placeholder="Mail address" disabled>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-key"></i>
                        </span>
                        <input id="register-password-1" name="register-password-1" type="password" class="form-control" 
                            placeholder="User Password (at least 8 characters)" disabled>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1" style="width:50px;">
                            <i class="fas fa-key"></i>
                        </span>
                        <input id="register-password-2" name="register-password-2" type="password" class="form-control" 
                            placeholder="Repeat User Password" disabled>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-success" disabled>Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="insertCodeModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="insertCodeModalLabel">Insert Template at Cursor Position</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
