#ifndef __VECTOR_H__
#define __VECTOR_H__

struct vector 
{
  double a[3];
};


// összeg
vector add(vector a, vector b) 
{
  return {a.a[0]+b.a[0],a.a[1]+b.a[1],a.a[2]+b.a[2]};
}
  
// különbség
vector sub(vector a, vector b) 
{
  return {a.a[0]-b.a[0],a.a[1]-b.a[1],a.a[2]-b.a[2]};
}
  
// skaláris szorzat
double dot(vector a, vector b) 
{
  return a.a[0]*b.a[0]+a.a[1]*b.a[1]+a.a[2]*b.a[2];
}
  
// skalárral való szorzat
vector mul(vector a, double b) 
{
  return {a.a[0]*b,a.a[1]*b,a.a[2]*b};
}
  
// hossz
double len(vector a) 
{
  return sqrt(dot(a,a));
}
  
// normalizálás
vector nor(vector a) 
{
  return mul(a,1.0/sqrt(dot(a,a)));
}
  
// hajlásszög
double ang(vector a, vector b) 
{
  return 180.0/M_PI*acos(dot(a,b)/(len(a)*len(b)));
}
  
// vektoriális szorzat
vector vec(vector a, vector b) 
{
  return {-a.a[2]*b.a[1] + a.a[1]*b.a[2], a.a[2]*b.a[0] - a.a[0]*b.a[2], -a.a[1]*b.a[0] + a.a[0]*b.a[1]};
}
  
// lineáris interpoláció
vector interpolate(vector a, vector b,double t) 
{
  return {(1-t)*a.a[0]+t*b.a[0],(1-t)*a.a[1]+t*b.a[1],(1-t)*a.a[2]+t*b.a[2]};
}
  
// másolat készítése
vector copy(vector a) 
{
  return {a.a[0],a.a[1],a.a[2]};
}

double circleSphereIntersection(
  double cx,double cy,double cz,
  double cr,
  double cnx,double cny,double cnz,
  double sx,double sy,double sz,
  double sr,
  double vx,double vy,double vz) 
{
    
  // kör középpontja
  vector cc = {cx,cy,cz};
  // kör síkjának normálvektora
  vector cn = {cnx,cny,cnz};
  // normalizálás
  cn = nor(cn);
  // gömb középpontja
  vector sc = {sx,sy,sz};
    
  // gömb középpontjából a kör középpontjába mutató vektor vetítése a kör síkjára
  vector pv=sub(sub(sc,cc),mul(cn,(dot(sub(sc,cc),cn)/dot(cn,cn))));
  // a kör és a gömb középpontjainak a távolsága a kör síkjában
  double d=len(pv);

  // metszéskör sugarának a meghatározása
  double r=sqrt(sr*sr-dot(sub(pv,sub(sc,cc)),sub(pv,sub(sc,cc))));
    
  // metszéskör középpontjának a meghatározása
  vector c=add(cc,pv);

  // a kör sugarának vetülete a kör és a metszéskör középpontjait összekötő szakaszra
  double cd = .5*(cr*cr + d*d - r*r)/d;
    
  // a kör és a metszéskör középpontjait összekötő szakasz és a metszéspontokat összekötő szakasz metszéspontja
  vector F=add(cc,mul(nor(pv),cd));
    
  // kör és metszetkör metszéspontjainak a távolságának a felének a meghatározása
  double h=sqrt(cr*cr-cd*cd);
    
  // kör és gömb metszéspontjainak a meghatározása a kör és metszéskör középpontjait összekötő vektor 90 fokkal 
  //  való elforgatásával a metszéskör síkjának normálvektora körül normalizálva majd megszorozva a megfelelő hosszúsággal
  vector M=add(F,mul(nor(add(vec(cn,pv),mul(cn,dot(cn,pv)))),h));
        
  // elforgatás szögének a meghatározása egy referencia vektorhoz képest
  vector v1={vx,vy,vz};
  vector v2=sub(M,cc);
  double angle=ang(v1,v2);
    
  return angle;
}
  
double calcAngle(
  double x0, double y0, double z0, 
  double x1, double y1, double z1, 
  double dm, double lm, double le, double la, 
  double nx, double ny, double nz, 
  double ux, double uy, double uz, 
  double t) 
{
    
    double ex=(1-t)*x0+t*x1;
    double ey=(1-t)*y0+t*y1;
    double ez=(1-t)*z0+t*z1;
    
    return circleSphereIntersection(ux*dm/2.,uy*dm/2.,uz*dm/2.,lm,nx,ny,nz,ex+ux*le/2.,ey+uy*le/2.,ez+uz*le/2.,la,ux,uy,uz);
}
  
// tömb kiiratása
void print(vector a) 
{
  debug("[");
  for (int i = 0; i < 3; i++) {
    debug(a.a[i]);
    debug(2>i ? " " : "");
  }
  debug("]\n");
}
  
// szám kiiratása
void print(double a) 
{
  debug(a);
}

int toSteps(double angle) 
{
  return (int)(angle/1.8);
}

#endif
