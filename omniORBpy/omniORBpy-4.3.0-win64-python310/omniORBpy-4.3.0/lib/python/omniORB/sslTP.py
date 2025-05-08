# -*- Mode: Python; -*-
#                            Package   : omniORBpy
# sslTP.py                   Created on: 2002/09/06
#                            Author    : Duncan Grisby (dgrisby)
#
#    Copyright (C) 2002-2018 Apasphere Ltd.
#
#    This file is part of the omniORBpy library
#
#    The omniORBpy library is free software; you can redistribute it
#    and/or modify it under the terms of the GNU Lesser General
#    Public License as published by the Free Software Foundation;
#    either version 2.1 of the License, or (at your option) any later
#    version.
#
#    This library is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Lesser General Public License for more details.
#
#    You should have received a copy of the GNU Lesser General Public
#    License along with this library. If not, see http://www.gnu.org/licenses/
#
#
# Description:
#    Import this to enable the SSL transport.

"""omniORB.sslTP

Import this module and set the files/passwords before calling
CORBA.ORB_init() to make the SSL transport available.

Functions:

  set_CA()
  set_key()
  set_cipher_list()
  reinit()

Deprecated functions:

  certificate_authority_file()
  certificate_authority_path()
  key_file()
  key_file_password()
"""

import omniORB

if omniORB.omniorb_dll_path is not None:
    import os
    with os.add_dll_directory(omniORB.omniorb_dll_path):
        import _omnipy
        from _omnisslTP import *
else:
    import _omnipy
    from _omnisslTP import *
