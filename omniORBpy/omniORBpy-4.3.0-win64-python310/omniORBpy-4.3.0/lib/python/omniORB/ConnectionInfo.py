# -*- Mode: Python; -*-
#                            Package   : omniORBpy
# ConnectionInfo.py          Created on: 2018/09/27
#                            Author    : Duncan Grisby (dgrisby)
#
#    Copyright (C) 2018-2019 Apasphere Ltd
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
#    ConnectionInfo constants

# Generic events
BIND                    = 0x01
ACCEPTED_CONNECTION     = 0x02

TRY_CONNECT             = 0x03
CONNECTED               = 0x04
CONNECT_FAILED          = 0x05
SEND_FAILED             = 0x06
RECV_FAILED             = 0x07
CONNECT_TIMED_OUT       = 0x08
SEND_TIMED_OUT          = 0x09
RECV_TIMED_OUT          = 0x0a
CLOSED                  = 0x0b

RESOLVE_NAME            = 0x0c
NAME_RESOLVED           = 0x0d
NAME_RESOLUTION_FAILED  = 0x0e


# TLS / SSL events

TRY_TLS_CONNECT         = 0x101
TLS_CONNECTED           = 0x102
TLS_CONNECT_FAILED      = 0x103
TLS_CONNECT_TIMED_OUT   = 0x104
TRY_TLS_ACCEPT          = 0x105
TLS_ACCEPTED            = 0x106
TLS_ACCEPT_FAILED       = 0x107
TLS_ACCEPT_TIMED_OUT    = 0x108
TLS_PEER_CERT           = 0x109
TLS_PEER_VERIFIED       = 0x10a
TLS_PEER_NOT_VERIFIED   = 0x10b
TLS_PEER_IDENTITY       = 0x10c


# HTTP events

CONNECT_TO_PROXY        = 0x201
PROXY_CONNECT_REQUEST   = 0x202
PROXY_REQUIRES_AUTH     = 0x203
SEND_HTTP_ERROR         = 0x204
RECV_HTTP_ERROR         = 0x205
HTTP_BUFFER_FULL        = 0x206
SEND_WEBSOCKET_REQ      = 0x207
RECV_WEBSOCKET_REQ      = 0x208
SEND_WEBSOCKET_ACK      = 0x209
RECV_WEBSOCKET_ACK      = 0x20a
RECV_WEBSOCKET_REJECT   = 0x20b


# HTTP crypto events

SEND_SESSION_KEY        = 0x301
RECEIVED_SESSION_KEY    = 0x302
CRYPTO_CLIENT_UNKNOWN   = 0x303
INVALID_SESSION_KEY     = 0x304
