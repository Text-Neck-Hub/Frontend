

import React, { useState } from 'react'; 
import styled from 'styled-components';
import { Link } from 'react-router-dom';


export interface NavLink {
    text: string;
    url: string;
    onClick?: () => void;
}


interface NavbarProps {
    brandName?: string;
    links?: NavLink[];
}

const breakpoints = {
    tablet: '768px',
    mobile: '480px',
};


const StyledNav = styled.nav`
    background-color: #333;
    padding: 1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    min-height: 60px;
    position: relative; /* 햄버거 메뉴 위치 지정을 위해 */
`;


const StyledBrandLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 2; /* 햄버거 메뉴 위에 보이도록 */

    &:hover {
        color: #ddd;
    }
`;


const StyledNavLinks = styled.ul<{ isOpen: boolean }>`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex; /* 데스크톱 기본 */

    @media (max-width: ${breakpoints.tablet}) {
        flex-direction: column;
        background-color: #333;
        position: absolute;
        top: 100%; /* 네비게이션 바 바로 아래 */
        left: 0;
        width: 100%;
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')}; /* 햄버거 메뉴 토글 */
        z-index: 1; /* 콘텐츠 위에 보이도록 */
    }
`;


const StyledNavLinkItem = styled.li`
    margin-left: 1.5rem; /* 데스크톱에서 간격 */

    @media (max-width: ${breakpoints.tablet}) {
        margin: 0; /* 모바일에서 간격 제거 */
        width: 100%; /* 모바일에서 전체 너비 사용 */
        text-align: center;
        border-bottom: 1px solid #444; /* 모바일 메뉴 구분선 */
        &:last-child {
            border-bottom: none;
        }
    }
`;


const CommonLinkButtonStyles = `
    color: white;
    text-decoration: none;
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    font-family: inherit;
    background: none;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    width: 100%; /* 모바일에서 버튼 너비 100% */
    display: block; /* 모바일에서 블록 레벨로 */

    &:hover {
        background-color: #555;
    }
`;

const StyledRouterLink = styled(Link)`
    ${CommonLinkButtonStyles}
`;

const StyledAnchor = styled.a`
    ${CommonLinkButtonStyles}
`;

const StyledButton = styled.button`
    ${CommonLinkButtonStyles}
`;


const HamburgerIcon = styled.div`
    display: none; /* 데스크톱에서는 숨김 */
    font-size: 2rem;
    cursor: pointer;
    color: white;
    z-index: 2; /* 햄버거 메뉴 위에 보이도록 */

    @media (max-width: ${breakpoints.tablet}) {
        display: block; /* 태블릿/모바일에서 보임 */
    }
`;


const Navbar: React.FC<NavbarProps> = ({ brandName = '우리 서비스', links = [] }) => {
    
    const [isOpen, setIsOpen] = useState(false);

    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <StyledNav>
            
            <StyledBrandLink to="/">
                {brandName}
            </StyledBrandLink>

            
            <HamburgerIcon onClick={toggleMenu}>
                &#9776; 
            </HamburgerIcon>

           
            <StyledNavLinks isOpen={isOpen}>
                {links.map((link: NavLink, index: number) => (
                    <StyledNavLinkItem key={index} onClick={() => setIsOpen(false)}>
                        {link.onClick ? (
                            <StyledButton onClick={link.onClick}>
                                {link.text}
                            </StyledButton>
                        ) : link.url.startsWith('/') ? (
                            <StyledRouterLink to={link.url}>
                                {link.text}
                            </StyledRouterLink>
                        ) : (
                            <StyledAnchor href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.text}
                            </StyledAnchor>
                        )}
                    </StyledNavLinkItem>
                ))}
            </StyledNavLinks>
        </StyledNav>
    );
};



export default Navbar;