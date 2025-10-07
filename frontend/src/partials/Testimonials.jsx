import React from 'react';

function Benefits() {
  return (
    <section className="relative">

      {/* Illustration behind content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32" aria-hidden="true">
        <svg width="1760" height="518" viewBox="0 0 1760 518" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-02">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g transform="translate(0 -3)" fill="url(#illustration-02)" fillRule="evenodd">
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 mb-4">Why Choose HÜNER?</h2>
            <p className="text-xl text-gray-600" data-aos="zoom-y-out">Hüner isn't just a platform; it's a solution designed to simplify your hiring process. We offer a curated, transparent, and efficient way to connect with top-tier talent, without the usual headaches.</p>
          </div>

          {/* Items - Replaced company logos with benefit cards */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {/* 1st card */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <svg className="w-16 h-16 p-1 -mt-1 mb-2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                        <rect className="fill-current text-blue-600" width="64" height="64" rx="32" />
                        <g strokeWidth="2" strokeLinecap="square" transform="translate(19.429 19.429)">
                            <path className="stroke-current text-white" d="M11.428 12.571V0M.571 12.571h21.143" />
                            <path className="stroke-current text-white" d="M11.428 12.571c2.186 0 3.857-2.614 3.857-5.714C15.285 3.738 13.614 1.143 11.428 1.143c-2.185 0-3.857 2.595-3.857 5.714s1.672 5.714 3.857 5.714z" />
                            <path className="stroke-current text-blue-300" d="M2.286 21.143h18.285M.571 19.429h21.143" />
                            <path className="stroke-current text-white" d="M5.143 21.143h13.714" />
                            <path className="stroke-current text-blue-300" d="M7.429 21.143h9.143" />
                        </g>
                    </g>
                </svg>
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Curated Talent Pool</h4>
                <p className="text-gray-600 text-center">We only accept top-tier developers, ensuring you have access to a pool of highly skilled professionals who are ready to make an impact.</p>
            </div>
            {/* 2nd card */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <svg className="w-16 h-16 p-1 -mt-1 mb-2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                        <rect className="fill-current text-blue-600" width="64" height="64" rx="32" />
                        <g strokeWidth="2" strokeLinecap="square" transform="translate(19.429 19.429)">
                            <path className="stroke-current text-white" d="M11.428 12.571V0M.571 12.571h21.143" />
                            <path className="stroke-current text-white" d="M11.428 12.571c2.186 0 3.857-2.614 3.857-5.714C15.285 3.738 13.614 1.143 11.428 1.143c-2.185 0-3.857 2.595-3.857 5.714s1.672 5.714 3.857 5.714z" />
                            <path className="stroke-current text-blue-300" d="M2.286 21.143h18.285M.571 19.429h21.143" />
                            <path className="stroke-current text-white" d="M5.143 21.143h13.714" />
                            <path className="stroke-current text-blue-300" d="M7.429 21.143h9.143" />
                        </g>
                    </g>
                </svg>
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Flexible and Transparent</h4>
                <p className="text-gray-600 text-center">Choose from various engagement models and get transparent pricing without hidden fees. You're in control of your budget and project scope.</p>
            </div>
            {/* 3rd card */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <svg className="w-16 h-16 p-1 -mt-1 mb-2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                        <rect className="fill-current text-blue-600" width="64" height="64" rx="32" />
                        <g strokeWidth="2" strokeLinecap="square" transform="translate(19.429 19.429)">
                            <path className="stroke-current text-white" d="M11.428 12.571V0M.571 12.571h21.143" />
                            <path className="stroke-current text-white" d="M11.428 12.571c2.186 0 3.857-2.614 3.857-5.714C15.285 3.738 13.614 1.143 11.428 1.143c-2.185 0-3.857 2.595-3.857 5.714s1.672 5.714 3.857 5.714z" />
                            <path className="stroke-current text-blue-300" d="M2.286 21.143h18.285M.571 19.429h21.143" />
                            <path className="stroke-current text-white" d="M5.143 21.143h13.714" />
                            <path className="stroke-current text-blue-300" d="M7.429 21.143h9.143" />
                        </g>
                    </g>
                </svg>
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Seamless Collaboration</h4>
                <p className="text-gray-600 text-center">Our integrated tools and dedicated support team ensure smooth communication and collaboration, from the first line of code to the final launch.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Benefits;