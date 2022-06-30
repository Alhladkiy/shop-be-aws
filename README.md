# shop-be-aws

# SQL script, if I right understood

create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    img text,
    price integer
)

create table stock (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products"("id")
)

insert into products (title, description, img, price) values
('Nike Phantom GT2 Elite FG', 'professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/data-images-butsi-nike-db5611-611-693x465-1024x1024.jpg', 100),
('Nike Mercurial Superfly 8', 'professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/FG/new/data-images-butsi-nike-cq7635-600-693x465-1024x1024.jpg', 195),
('Nike Phantom GT2 Elite FG', 'semi-professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/FG/new/data-images-butsi-nike-cq7635-090-693x465-1024x1024.jpg', 205),
('Nike Phantom GT Elite FG', 'professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/unnamed-1024x1024.jpg', 260),
('Nike Mercurial Vapor 14', 'semi-professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/unnamed31414-1024x1024.jpg', 315),
('Nike Phantom GT Elite SE', 'sprofessional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/FG/new/data-images-butsi-nike-aq4176-060-693x465-1024x1024.jpg', 600),
('Nike Phantom GT Elite SE', 'professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/FG/new/data-images-butsi-nike-aq4176-801-693x465-1024x1024.jpg', 410),
('Nike Phantom GT Elite SE', 'professional boots', 'https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/data-images-butsi-nike-ct2156-001-693x465-1024x1024.jpg', 355)


create extension if not exists "uuid-ossp";