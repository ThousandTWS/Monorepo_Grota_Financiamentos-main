package org.example.middleware;


// Class Para Checar limite de pedidos
public class ThrttlingMiddleware extends Middleware {
    private int requestPerMinute;
    private int request;
    private long currentTime;

    public ThrttlingMiddleware(int requestPerMinute) {
        this.requestPerMinute = requestPerMinute;
        this.currentTime = System.currentTimeMillis();
    }

    public boolean check(String email, String password) {
        if (System.currentTimeMillis() > currentTime + 60_000) {
            request = 0;
            currentTime = System.currentTimeMillis();
        }
        request++;

        if (request > requestPerMinute) {
            System.out.println("Request Limit exedeu");
            Thread.currentThread().stop();
        }
        return checkNext(email, password);
    }
}
