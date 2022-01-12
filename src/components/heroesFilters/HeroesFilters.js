import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { filtersFetchingError, filtersFetched, filtersFetching, activeFilterChanged } from '../../actions';
import Spinner from '../spinner/Spinner';


// Задача для этого компонента:

// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active

const HeroesFilters = () => {
    const { filters, filtersLoadingStatus, activeFilter } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner></Spinner>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
    }

    const renderFiltersButtonsList = (arr) => {
        if (arr.length === 0) {
            return <h5 className='text-center mt-5'>Фильтры не найдены</h5>
        }

        return arr.map(({name, text, styles}) => {
            const btnClass = classNames('btn', styles, {
                'active': name === activeFilter
            });

            return <button
                        onClick={() => dispatch(activeFilterChanged(name))}
                        key={name}
                        id={name}
                        className={btnClass}>
                            {text}</button>
        })
    }  

    const filtersButtonssList = renderFiltersButtonsList(filters);
    
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {
                        filtersButtonssList
                    }
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;