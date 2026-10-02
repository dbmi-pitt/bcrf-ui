import React from 'react'
import Link from 'next/link';

function AboutH1({ dataSourceId, title, path, buttonTitle, buttonClassName }) {
  return (
    <>
      <h1 className='h2'>{title} / <Link href={`/sources/${dataSourceId}/about/`}>{dataSourceId}</Link></h1>
      <Link
        href={`/sources/${dataSourceId}/about/${path}`}
        className="c-btn c-btn--secondary c-btn--sm"
      >
        {buttonTitle} &nbsp;<i className={`bi ${buttonClassName} text-white`}></i>
      </Link>
    </>
  )
}

export default AboutH1