export function ArticleEngagement({ likes, comments, share, copied, copiedLabel, shareBtn }) {
    return (
        <div className="art-engage">
            <div className="art-engage__left">
                <div className="art-engage__item">
                    <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{likes}</span>
                </div>
                <div className="art-engage__item">
                    <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{comments}</span>
                </div>
            </div>
            <div className="art-engage__right">
                <button className="art-engage__share" onClick={share}>
                    <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {copied ? copiedLabel : shareBtn}
                </button>
            </div>
        </div>
    )
}