import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, MorphSVGPlugin, DrawSVGPlugin)

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

export { DrawSVGPlugin, Flip, gsap, MorphSVGPlugin, ScrollTrigger, SplitText, useGSAP }
