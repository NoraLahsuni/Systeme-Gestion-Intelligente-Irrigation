# -*- Mode: Python; -*-
#                            Package   : omniORBpy
# httpCrypto.py              Created on: 2018/07/13
#                            Author    : Duncan Grisby (dgrisby)
#
#    Copyright (C) 2018      BMC Software
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
#    Import this to enable the HTTP crypto library.

"""omniORB.httpCrypto

Import this module and call init() before calling CORBA.ORB_init() to
enable http in-message encryption.

Functions:

  init()
  addClient()
  removeClient()
  addServer()
  removeServer()
"""

import omniORB

if omniORB.omniorb_dll_path is not None:
    import os
    with os.add_dll_directory(omniORB.omniorb_dll_path):
        import _omnipy
        from _omnihttpCrypto import *
else:
    import _omnipy
    from _omnihttpCrypto import *
