#ifndef __DEBUG_H__
#define __DEBUG_H__

#ifdef DEBUG
# define debug(s) Serial.print(s);
#else
# define debug(s) {};
#endif

#endif
