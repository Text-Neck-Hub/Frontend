

// import React, { useState } from 'react'; 
// import styled from 'styled-components';
// import { Link } from 'react-router-dom';




// const Style = styled.div`
//     background-color: #333;
//     padding: 1rem;
//     color: white;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//     min-height: 60px;
//     position: relative; /* 햄버거 메뉴 위치 지정을 위해 */
// `;



// const AngleOption: React.FC<NavbarProps> = ({ brandName = '우리 서비스', links = [] }) => {
    
//     const [isOpen, setIsOpen] = useState(false);

    
//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <StyledNav>
            
//             <StyledBrandLink to="/">
//                 {brandName}
//             </StyledBrandLink>

            
//             <HamburgerIcon onClick={toggleMenu}>
//                 &#9776; 
//             </HamburgerIcon>

           
//             <StyledNavLinks isOpen={isOpen}>
//                 {links.map((link: NavLink, index: number) => (
//                     <StyledNavLinkItem key={index} onClick={() => setIsOpen(false)}>
//                         {link.onClick ? (
//                             <StyledButton onClick={link.onClick}>
//                                 {link.text}
//                             </StyledButton>
//                         ) : link.url.startsWith('/') ? (
//                             <StyledRouterLink to={link.url}>
//                                 {link.text}
//                             </StyledRouterLink>
//                         ) : (
//                             <StyledAnchor href={link.url} target="_blank" rel="noopener noreferrer">
//                                 {link.text}
//                             </StyledAnchor>
//                         )}
//                     </StyledNavLinkItem>
//                 ))}
//             </StyledNavLinks>
//         </StyledNav>
//     );
// };



// export default Navbar;