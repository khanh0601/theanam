const parseRem = (input) => {
    return (input / 10) * parseFloat(getComputedStyle(document.querySelector('html')).fontSize)
}
function getScreenType() {
    const width = window.innerWidth;
    let type = width > 991 ? 'dsk' : window.innerWidth > 767 ? 'tb' : 'mb';
    let size = width;
    const isMobile = width <= 767;
    const isTablet = width > 767 && width <= 991;
    const isDesktop = width > 991;
    return { type, size , isMobile, isDesktop, isTablet };
}

function convertHyphen(el) {
    el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/-/g, '‑');
        }
    });
}
class MasterTimeline {
    constructor({ triggerInit, timeline, tweenArr, stagger = .2, scrollTrigger, allowMobile }) {
        this.timeline = timeline;
        this.triggerInit = triggerInit;
        this.scrollTrigger = scrollTrigger;
        this.tweenArr = tweenArr;
        this.stagger = stagger;
        this.allowMobile = getScreenType().isMobile ? allowMobile : true;
        this.setup();
    }
    setup() {
        if (!this.allowMobile) return;
        gsap.timeline({
            scrollTrigger: {
                trigger: this.triggerInit,
                start: 'top bottom+=100vh',
                end: 'bottom top',
                once: true,
                scrub: false,
                onEnter: () => {
                    this.tweenArr.forEach((item) => item.init?.())
                }
            }
        });
        if (!this.timeline) {
            this.timeline = gsap.timeline({
                scrollTrigger: {
                    start: 'top top+=80%',
                    end: '+=100%',
                    scrub: false,
                    once: true,
                    ...this.scrollTrigger
                }
            })
        };
        this.tweenArr.forEach((item) => this.timeline.add(item.animation, item.delay || `<=${this.stagger}` || "<=.1"));
    }
}
class TextSplit {
    constructor({ el, type, headingType = false }) {
        if (!el) return;
        this.DOM = { el: el, splitType: new SplitType(el, { types: type || 'lines', lineClass: headingType == true ? 'heading-line split-line' : 'split-line' })};
        this.init()
    }
    init() {
        convertHyphen(this.DOM.el);
        this.DOM.splitType.lines && this.DOM.splitType.lines.forEach((line) => {
            const div = document.createElement('div');
            div.appendChild(line);
            div.classList.add('line__mask');
            if (line.classList.contains('heading-line')) {
                div.classList.add('heading-line-mask');
            }
            this.DOM.el.appendChild(div);
        });
    }
}
class RevealText {
    constructor({ el, color, delay, isDisableRevert, isHighlight = false, isFast = false, ...props }) {
        this.DOM = { el: el };
        this.color = color;
        this.textSplit = [];
        this.delay = delay;
        this.textSplit = new SplitType(this.DOM.el, { types: 'lines, words' });
        const isColorDefault = this.color === 'white' || this.color === 'black';
        this.fromColor = !isColorDefault ? 'rgba(255,255,255, 0)' : this.color == 'white' ? 'rgba(255,255,255, 0)' : 'rgba(29,29,29, 0)';
        this.toColor = !isColorDefault ? this.color : this.color == 'white' ? 'rgba(255,255,255, 1)' : 'rgba(29,29,29, 1)';

        if (isHighlight) {
            this.animation = gsap.timeline({
                onComplete: () => {
                    if (!isDisableRevert) {
                        this.textSplit.revert();
                    }
                },
                ...props
            });
            this.textSplit.words.forEach((word, idx) => {
                let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
                this.animation.to(word, {
                    keyframes: {
                        color: [this.fromColor, '#FF6B30', toColor],
                        easeEach: 'power2.in',
                        ease: 'power1.out',
                    },
                    duration: isFast ? 0.8 : 1
                }, idx * (isFast ? 0.03 : 0.08))
            });
        }
        else {
            this.animation = gsap.to(this.textSplit.words, {
                keyframes: {
                    color: [this.fromColor, '#FF6B30', this.toColor],
                    easeEach: 'power2.in',
                    ease: 'power1.out',
                },
                duration: isFast ? 0.8 : 1,
                stagger: isFast ? 0.03 : 0.08,
                onComplete: () => {
                    if (!isDisableRevert) {
                        this.textSplit.revert();
                    }
                },
                ...props
            })
        }
    }
    init() {
        gsap.set(this.textSplit.words, { color: this.fromColor });
    }
}
class RevealTextReset  {
    constructor({ el, color, delay, isFast = false, isHighlight = false, ...props }) {
        this.DOM = { el: el };
        this.color = color;
        this.textSplit = [];
        this.delay = delay;
        this.isHighlight = isHighlight
        this.isFast = isFast;

        this.textSplit = new SplitType(this.DOM.el, { types: 'lines, words' });
        this.isColorDefault = this.color === 'white' || this.color === 'black';
        this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, 0)' : this.color == 'white' ? 'rgba(255,255,255, 0)' : 'rgba(29,29,29, 0)';
        this.toColor = !this.isColorDefault ? this.color : this.color == 'white' ? 'rgba(255,255,255, 1)' : 'rgba(29,29,29, 1)';

        if (this.isHighlight) {
            this.animation = gsap.timeline({
                onComplete: () => {
                    this.reset();
                },
                ...props
            });

            this.textSplit.words.forEach((word, idx) => {
                let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
                this.animation.to(word, {
                    keyframes: {
                        color: [this.fromColor, '#FF6B30', toColor],
                        easeEach: 'power2.in',
                        ease: 'power1.out',
                    },
                    duration: isFast ? 0.8 : 1
                }, idx * (isFast ? 0.03 : 0.08))
            });
        }
        else {
            this.animation = gsap.to(this.textSplit.words, {
                keyframes: {
                    color: [this.fromColor, '#FF6B30', this.toColor],
                    easeEach: 'power2.in',
                    ease: 'power1.out',
                },
                duration: isFast ? 0.8 : 1,
                stagger: isFast ? 0.03 : 0.08,
                onComplete: () => {
                    this.reset();
                },
                ...props
            })
        }
    }
    init() {
        if (getScreenType().isMobile) {
            this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, .1)' : this.color == 'white' ? 'rgba(255,255,255, .1)' : 'rgba(29,29,29, .1)';
            this.reset()
        }
        gsap.set(this.textSplit.words, { color: this.fromColor });
    }
    reset() {
        let isReset = true;
        let isInit = getScreenType().isMobile ? true : false;

        let tlText = gsap.timeline();
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.DOM.el,
                start: 'top top+=65%',
                end: 'bottom top+=65%',
                onEnter: () => {
                    if (isReset && isInit)  {
                        isReset = false;
                        if (this.isHighlight) {
                            this.textSplit.words.forEach((word, idx) => {
                                let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
                                tlText.to(word, {
                                    keyframes: {
                                        color: [this.fromColor, '#FF6B30', toColor],
                                        easeEach: 'power2.in',
                                        ease: 'power1.out',
                                    },
                                    duration: this.isFast ? 0.8 : 1
                                }, idx * (this.isFast ? 0.03 : 0.08))
                            });
                        }
                        else {
                            gsap.to(this.textSplit.words, {
                                keyframes: {
                                    color: [this.fromColor, '#FF6B30', this.toColor],
                                    easeEach: 'power2.in',
                                    ease: 'power1.out',
                                },
                                overwrite: true,
                                duration: this.isFast ? .8 : 1,
                                stagger: this.isFast ? .03 : .08,
                            })
                        }
                    }
                },
            }
        })
        let resetTL = gsap.timeline({
            scrollTrigger: {
                trigger: this.DOM.el,
                start: 'top bottom',
                end: 'bottom top',
                onLeaveBack: () => {
                    if (!isInit) {
                        this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, .1)' : this.color == 'white' ? 'rgba(255,255,255, .1)' : 'rgba(29,29,29, .1)';
                    }
                    isInit = true;

                    if (!isReset) isReset = true;
                    gsap.set(this.textSplit.words, {color: this.fromColor, overwrite: true })
                },
            }
        })
    }
}
class FadeSplitText {
    constructor({ el, delay, breakType, isDisableRevert, onMask, isFast=false, headingType = false, ...props }) {
        if (!el || el.textContent === '') return;
        this.DOM = { el: el };
        this.onMask = onMask || false;
        this.breakType = breakType || 'lines';
        this.textSplit = new TextSplit({
            el: this.DOM.el,
            type: this.onMask ?
                    this.breakType == 'lines' ?
                        this.breakType : `${this.breakType}, lines` : this.breakType,
                    headingType: headingType
        }).DOM.splitType;
        this.delay = delay;
        this.duration = isFast? 0.45 : .6;
        this.onMask && gsap.set(el.querySelectorAll('.line__mask'), { overflow: 'hidden' });
        this.animation = gsap.from(this.textSplit[this.breakType], {
            autoAlpha: 0,
            yPercent: 100,
            stagger: this.breakType == 'lines' ? 0.1 : 0.04,
            duration: this.breakType == 'lines' ? this.duration : 1,
            ease: 'power2.out',
            onComplete: () => {
                if (!isDisableRevert) {
                    this.textSplit.revert();
                    convertHyphen(this.DOM.el);
                }
            },
            ...props
        });
    }
    init() {
        document.fonts.onloadingdone = () => {
            gsap.set(this.textSplit[this.breakType], { autoAlpha: 0, yPercent: 100 });
        }
    }
}
class FadeIn {
    constructor({ el, type, delay, isDisableRevert, from, to, ...props }) {
        this.DOM = { el: el };
        this.type = type || 'default';
        this.delay = delay;
        this.options = {
            bottom: {
                set: { opacity: 0, y: parseRem(32), ...from },
                to: { opacity: 1, y: 0, ...to }
            },
            top: {
                set: { opacity: 0, y: parseRem(-32), ...from },
                to: { opacity: 1, y: 0, ...to }
            },
            left: {
                set: { opacity: 0, x: parseRem(32), ...from },
                to: { opacity: 1, x: 0, ...to },
            },
            right: {
                set: { opacity: 0, x: parseRem(-32), ...from },
                to: { opacity: 1, x: 0, ...to }
            },
            default: {
                set: { opacity: 0, y: parseRem(32), ...from },
                to: { opacity: 1, y: 0, ...to }
            }
        };

        if(!this.DOM.el) return;
        this.animation = gsap.fromTo(this.DOM.el,
            { ...this.options[this.type]?.set || this.options.default.set },
            { ...this.options[this.type]?.to || this.options.default.to,
            duration: 1,
            ease: 'power3',
            clearProps: isDisableRevert ? '' : 'all',
            ...props
        });
    }
    init() {
        if (!this.DOM.el) return;
        gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
}
class ScaleLine {
    constructor({ el, type, isCenter, delay, isDisableRevert, ...props }) {
        if (!el) return;

        this.DOM = { el: el };
        this.type = type || 'default';
        this.delay = delay;
        this.options = {
            top: {
                set: { scaleY: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
                to: { scaleY: 1 }
            },
            left: {
                set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
                to: { scaleX: 1 }
            },
            right: {
                set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top right' },
                to: { scaleX: 1 }
            },
            bottom: {
                set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'bottom right' },
                to: { scaleX: 1 }
            },
            default: {
                set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
                to: { scaleX: 1 }
            }
        };
        this.animation = gsap.fromTo(this.DOM.el,
            { ...this.options[this.type]?.set || this.options.default.set },
            { ...this.options[this.type]?.to || this.options.default.to,
                duration: 1.2,
                ease: 'power1.out',
                clearProps: isDisableRevert ? '' : 'all',
                ...props
            });
    }
    init() {
        if (!this.DOM?.el) return;

        gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
}

class ScaleInset {
    constructor({el, elInner, type, options, delay, duration }) {
        this.DOM = { el: el, elInner: elInner || el?.querySelector('img') };
        this.type = type;
        this.delay = delay;
        this.options = {
            default: {
                set: {
                    scale: 1.2,
                    autoAlpha: 0,
                },
                to: {
                    transformOrigin: 'center',
                    scale: 1,
                    autoAlpha: 1,
                }
            }
        };
        this.animation = gsap.fromTo(this.DOM.elInner,
            { ...this.options[this.type]?.set || this.options.default.set },
            {
                ...this.options[this.type]?.to || this.options.default.to, duration: duration? duration: 1.5, ease: 'circ.out',
                ...options,
                onComplete: () => {
                    gsap.set([this.DOM.el, this.DOM.elInner], { clearProps: 'all' });
                }
            });
    }
    init() {
        if (!this.DOM.el) return;
        gsap.set(this.DOM.el, { overflow: 'hidden' });
        gsap.set(this.DOM.elInner, { ...this.options[this.type]?.set || this.options.default.set});
    }
}