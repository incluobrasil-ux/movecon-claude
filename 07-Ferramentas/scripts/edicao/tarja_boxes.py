import numpy as np
def boxes(clip,K,t0,t1,m=15,step=1/15,W=None,H=None):
    """K: list of (t,x0,y0,x1,y1) in source coords (plate extents). Returns drawbox entries every step, overlapping by 1 frame."""
    T=np.array([k[0] for k in K]); out=[]; t=t0
    while t<t1-1e-6:
        tm=min(t+step/2,t1)
        x0,y0,x1,y1=[float(np.interp(tm,T,[k[i] for k in K])) for i in range(1,5)]
        x0-=m;y0-=m;x1+=m;y1+=m
        x0=max(0,x0);y0=max(0,y0)
        if W: x1=min(W,x1)
        if H: y1=min(H,y1)
        out.append({"clip":clip,"x":int(x0),"y":int(y0),"w":int(x1-x0),"h":int(y1-y0),"t0":round(t,4),"t1":round(min(t+step+1/30,t1+0.04),4)})
        t+=step
    return out
