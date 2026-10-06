import React from 'react'
import Link from 'next/link';

function AboutH1({ data, title, path, buttonTitle, buttonClassName }) {
  return (
    <>
      <h1 className='h2'>{title} / <Link href={`/sources/${data.source}/about/`}>{data.name}</Link></h1>
      <Link
        href={`/sources/${data.source}/about/${path}`}
        className="c-btn c-btn--secondary c-btn--sm"
      >
        {buttonTitle} &nbsp;<i className={`bi ${buttonClassName} text-white`}></i>
      </Link>
    </>
  )
}

export default AboutH1