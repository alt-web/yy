import Image from "next/image"
import { useState, useEffect, ReactNode, useCallback } from "react"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

import styles from "./slideshow.module.css"

const Slideshow = ({
    urls,
    descriptions,
    onSlideChange,
}: {
    urls: string[]
    descriptions: (string | null)[]
    onSlideChange?: (arg0: number) => void
}) => {
    // Current slide number
    const [index, setIndex] = useState(0)

    const onChange = useCallback(() => {
        if (onSlideChange) onSlideChange(index)
    }, [onSlideChange, index])

    // List of all slides
    const slideList = urls.map((url, itemIndex) => (
        <Slide key={url} index={itemIndex} activeIndex={index}>
            <Image src={url} alt="Photo" unoptimized={true} fill />
        </Slide>
    ))

    // Functions for changing the slide
    const prev = useCallback(() => {
        if (index > 0) setIndex(index - 1)
        else setIndex(slideList.length - 1)
        onChange()
    }, [index, onChange, slideList.length])
    const next = useCallback(() => {
        if (index + 1 < slideList.length) setIndex(index + 1)
        else setIndex(0)
        onChange()
    }, [index, onChange, slideList.length])

    useEffect(() => {
        // Bind arrow keys
        const handleClick = (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return // Do nothing if the event was already processed
            }
            if (e.repeat) {
                return
            }
            switch (e.key) {
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    prev()
                    break
                case "Right":
                case "ArrowRight":
                    next()
                    break
                default:
                    return
            }
            e.preventDefault()
        }
        window.addEventListener("keydown", handleClick)
        return () => {
            window.removeEventListener("keydown", handleClick)
        }
    }, [prev, next])

    // Load only 3 slides: current, previous and next
    const prevIndex = index > 0 ? index - 1 : slideList.length - 1
    const nextIndex = index + 1 < slideList.length ? index + 1 : 0
    const currentSlides = slideList.filter(
        (_item, itemIndex) =>
            itemIndex === index ||
            itemIndex === prevIndex ||
            itemIndex === nextIndex
    )

    return (
        <>
            <div className={styles.MainRow}>
                <Button onClick={prev}>
                    <LeftOutlined />
                </Button>

                <div className={styles.Placeholder}>{currentSlides}</div>

                <Button onClick={next}>
                    <RightOutlined />
                </Button>
            </div>
            <Description text={descriptions[index]} />
        </>
    )
}

const Slide = (props: {
    children: ReactNode
    index: number
    activeIndex: number
}) => {
    const style = {
        opacity: props.activeIndex === props.index ? 1 : 0,
    }
    return (
        <div style={style} className={styles.Slide}>
            {props.children}
        </div>
    )
}

const Button = (props: { onClick: () => void; children: ReactNode }) => {
    return (
        <button className={styles.Button} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

// The component processes the string and replaces the '<b>' tag with a real <span> tag.
// TODO: Add checks
const Description = ({ text }: { text: string | null }) => {
    const Body = ({ children }: { children?: ReactNode }) => (
        <div className={styles.Description}>{children}</div>
    )

    if (!text) return <Body></Body>

    // Split string using regular expression
    const array = text.split(/<b>|<\/b>/)
    return (
        <Body>
            {array.map((st, index) => {
                if (index % 2 === 0) return st
                return <span key={index}>{st}</span>
            })}
        </Body>
    )
}

export default Slideshow
