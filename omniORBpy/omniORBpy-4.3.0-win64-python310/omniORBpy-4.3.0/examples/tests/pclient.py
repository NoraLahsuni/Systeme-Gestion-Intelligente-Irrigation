#!/usr/bin/env python

import sys, time
from omniORB import CORBA, PortableServer
import PerfTest

cycles = 10000

def doTests(orb, poa, io):
    l = list(range(200))

    print("single long:    ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op0(i)
        i = i - 1
    a = time.time()
    print(a-b)

    s = bytes(l)

    print("octet sequence: ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op1(s)
        i = i - 1
    a = time.time()
    print(a-b)

    print("octet array:    ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op2(s)
        i = i - 1
    a = time.time()
    print(a-b)


    print("short sequence: ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op3(l)
        i = i - 1
    a = time.time()
    print(a-b)

    print("short array:    ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op4(l)
        i = i - 1
    a = time.time()
    print(a-b)


    print("long sequence:  ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op5(l)
        i = i - 1
    a = time.time()
    print(a-b)

    print("long array:     ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op6(l)
        i = i - 1
    a = time.time()
    print(a-b)

    print("ulong sequence: ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op7(l)
        i = i - 1
    a = time.time()
    print(a-b)

    print("ulong array:    ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op8(l)
        i = i - 1
    a = time.time()
    print(a-b)

    u = list(map(int, l))

    print("ulong sequence: ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op7(u)
        i = i - 1
    a = time.time()
    print(a-b)

    print("ulong array:    ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op8(u)
        i = i - 1
    a = time.time()
    print(a-b)

    print("double sequence:", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op9(l)
        i = i - 1
    a = time.time()
    print(a-b)

    print("double array:   ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.opa(l)
        i = i - 1
    a = time.time()
    print(a-b)

    d = list(map(float, l))

    print("double sequence:", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.op9(d)
        i = i - 1
    a = time.time()
    print(a-b)

    print("double array:   ", end=' ')
    sys.stdout.flush()

    i = cycles
    b = time.time()
    while (i):
        r = io.opa(d)
        i = i - 1
    a = time.time()
    print(a-b)





if __name__ == "__main__":
    orb = CORBA.ORB_init(sys.argv, CORBA.ORB_ID)
    poa = orb.resolve_initial_references("RootPOA")
    poa._get_the_POAManager().activate()

    io = orb.string_to_object(sys.argv[1])

    doTests(orb, poa, io)
