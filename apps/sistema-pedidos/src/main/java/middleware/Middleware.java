package org.example.middleware;

// Class para relizar validação basica
public abstract class Middleware {
    private Middleware next;

    public static Middleware link(Middleware fist, Middleware... chain) {
        Middleware head = fist;
        for (Middleware nextInChain: chain ) {
            head.next = nextInChain;
            head = nextInChain;
        }
        return  fist;
    }
    public boolean check(String email, String password) {
        return false;
    }

    protected boolean checkNext(String email, String password) {
        if (next == null) {
            return true;
        }
        return next.check(email, password);
    }
}





