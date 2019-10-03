var ScrolledOn = (function (genericEvent) {
        if (!genericEvent) {
                genericEvent = function (category, action, label, value, non_interaction) {
                        if(!non_interaction) {
                          non_interaction = false;
                        }
                        console.log('[scrolled-on]', {
                                'event': 'genericEvent',
                                'genericCategory': category,
                                'genericAction': action,
                                'genericLabel': label,
                                'genericValue': value,
                                'nonInteraction': non_interaction
                        });
                }
        }

var selectorContainer = '.infinito';
var selectorContent = '.content';
        
        var isScrolledIntoViewN = function (el) {
                var rect = el.getBoundingClientRect();
                var elemTop = rect.top;
                var elemBottom = rect.bottom;
                return (elemTop > 0 && elemTop < window.innerHeight / 2)
                        || (elemTop < 0 && elemBottom > window.innerHeight / 2);
        };
        
        var wordCounter = function (text) {
                return text.trim().replace(/(\s+|\r\n|\r|\n)/g, ' ').split(' ').length;
        };

        var scrolledOn = function (content) {
                
                if (!content) return;
                
                var words = {
                        gone: false,
                };
                
                var percents = {
                        '25': {
                                gone: false,
                        },
                        '50': {
                                gone: false,
                        },
                        '75': {
                                gone: false,
                        },
                        '100': {
                                gone: false,
                        },
                };
                
                var comments = {
                        el: (
                                content.closest(selectorContainer) 
                         && content.closest(selectorContainer).querySelector('.comentarios')
                        ),
                        gone: false,
                };
                
                var fn = function () {
                        if (words.gone && comments.gone) {
                                window.removeEventListener('scroll', fn);
                                
                                console.log('[scrolled-on] words ', words);
                                console.log('[scrolled-on] comments ', comments);
                                console.log('[scrolled-on] percents ', percents);
                        }
                        
                        if (!window.isJumping 
                         && percents['100'].gone 
                         && comments.el 
                         && !comments.gone 
                         && isScrolledIntoViewN(comments.el)
                        ) {
                                genericEvent('engajamento', 'scroll_noticia', 'scroll_comentario');
                                comments.gone = true;
                        }
                        
                        if (window.isJumping || !isScrolledIntoViewN(content)) return;
                        
                        var rect = content.getBoundingClientRect();
                        
                        var scrolled = rect.height - rect.bottom + window.innerHeight / 2;
                        
                        percents['25'].size = rect.height * 25 / 100;
                        percents['50'].size = rect.height * 50 / 100;
                        percents['75'].size = rect.height * 75 / 100;
                        percents['100'].size = rect.height - window.innerHeight / 2;
      
              // console.log('[scrolled-on] words ', words);
              // console.log('[scrolled-on] comments ', comments);
              // console.log('[scrolled-on] percents ', percents);
              // console.log('[scrolled-on] scrolled ', scrolled);
              // console.log('[scrolled-on] rect ', rect);
                        
                        if (!words.gone) {
                                words.total = wordCounter(content.innerText);
                                words.gone = true;
                                genericEvent('engajamento', 'word_counter', words.total, undefined, true);
                        }
                        
                        if (((scrolled >= percents['25'].size && scrolled < percents['50'].size)
         || (scrolled >= percents['25'].size && rect.y >= 0))
                         && !percents['25'].gone
                        ) {
                                percents['25'].gone = true;
                                genericEvent('engajamento', 'maxscroll_noticia', 'scroll 25%', 25);
                        } 
                        if (scrolled >= percents['50'].size 
                         && !percents['50'].gone 
                         && percents['25'].gone
                        ) {
                                percents['50'].gone = true;
                                genericEvent('engajamento', 'maxscroll_noticia', 'scroll 50%', 50);
                        }
                        if (scrolled >= percents['75'].size 
                         && !percents['75'].gone 
                         && percents['50'].gone
                        ) {
                                percents['75'].gone = true;
                                genericEvent('engajamento', 'maxscroll_noticia', 'scroll 75%', 75);
                        } 
                        if (scrolled >= percents['100'].size 
                         && !percents['100'].gone 
                         && percents['75'].gone
                        ) {
                                percents['100'].gone = true;
                                genericEvent('engajamento', 'maxscroll_noticia', 'scroll 100%', 100);
                        }
                };
                window.addEventListener('scroll', fn);
        };

        var scrolledOnAll = function (selectorC, selectorC2) {
          selectorContainer = selectorC || selectorContainer;
    selectorContent = selectorC2 || selectorContent;
                document.querySelectorAll(selectorContainer).forEach(function (container) {
                        container.querySelector(selectorContent) && scrolledOn(container.querySelector(selectorContent));
                });
        };
        
        return {
                scrolledOn: scrolledOn,
                scrolledOnAll: scrolledOnAll,
        };
})(window.dp6GenericEvent);
// enable events in the reportagem-especial
if (document.querySelector('body').classList.contains('reportagem-especial')) 
        ScrolledOn.scrolledOnAll();
